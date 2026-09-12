"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  KeyboardEvent,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FLAVOURS, Flavour, FlavourSlug } from "@/data/flavours";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useToast } from "@/components/toast/ToastProvider";
import { MascotAvatar, MascotFlavour } from "@/components/mascot-avatar/MascotAvatar";
import { Pill } from "@/components/pill/Pill";
import { Grain } from "@/components/grain/Grain";
import { NotifyForm, NotifyPayload, NotifyResult } from "@/components/notify-form/NotifyForm";
import { useRecentCommands } from "./useRecentCommands";
import { useSoundToggle } from "./useSoundToggle";
import styles from "./command-palette.module.css";

type Tone = "pataka" | "malai" | "jaadu" | "pehelwan" | "marigold" | "rani" | "peacock" | "indigo" | "accent" | "night";

interface CommandDef {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  group: "Jump to" | "Flavours" | "Actions" | "Theme";
  tone: Tone;
  icon: ReactNode;
  shortcut?: string;
  /** Whether selecting this closes the palette. Only the inline notify morph opts out. */
  closesOnSelect: boolean;
  onSelect: () => void;
}

// No copy endpoint yet — this is the same code the notify flow will hand
// out once §08's checkout exists.
const DISCOUNT_CODE = "HEYFIRST10";
const SUCCESS_HOLD_MS = 1200;
const ANNOUNCE_DEBOUNCE_MS = 300;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function matchesQuery(command: Pick<CommandDef, "label" | "description" | "keywords">, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    command.label.toLowerCase().includes(q) ||
    command.description.toLowerCase().includes(q) ||
    command.keywords.some((kw) => kw.toLowerCase().includes(q))
  );
}

/**
 * Global command palette: keyboard-driven navigation, theme switcher, and inline notify flow.
 *
 * **Scrim implementation:**
 * - Overlay uses `.overlay` class with `rgb(var(--scrim) / var(--scrim-opacity-default))`
 * - This is a 60% opacity dark overlay; differs from Modal's 70% (`--scrim-opacity-dark`)
 * - Both scrims use the same scrim colour token (20 17 15) but different opacity scales for UX
 *
 * **Focus management:**
 * - Focus is trapped inside the palette when open (via cmdk library)
 * - Focus is returned to the trigger pill on close
 * - Live region announces search results to screen readers (polite priority)
 *
 * **Inline notify morph:**
 * - When "Notify me" is selected, the palette morphs in place (height animates, content cross-fades)
 * - Only shows email + flavour chips + submit (phone/pin code stay in Modal at §08)
 * - On success: panel fills with flavour colour, shows "✱ you're in." for 1.2s, then closes
 *
 * **Reduced motion:**
 * - All animations disabled; content appears instantly
 * - Marquee (in header) becomes static when open, resumes on close
 */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { theme, setTheme, night, setNight } = useTheme();
  const toast = useToast();
  const { enabled: soundEnabled, toggle: toggleSound } = useSoundToggle();
  const { recentIds, hydrate: hydrateRecents, addRecent } = useRecentCommands();

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "notify" | "success">("list");
  const [successTone, setSuccessTone] = useState<MascotFlavour>("pataka");
  const [announcement, setAnnouncement] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  // Reset to the list view a beat after close, once the exit animation has
  // had a chance to run, so reopening never flashes the previous session's
  // notify form or success state.
  useEffect(() => {
    if (open) {
      hydrateRecents();
      return;
    }
    const timer = setTimeout(() => {
      setView("list");
      setSearch("");
    }, 200);
    return () => clearTimeout(timer);
  }, [open, hydrateRecents]);

  // Height morph: measure whatever's currently mounted inside .content and
  // transition the wrapper to match, so switching list -> notify form ->
  // success animates height instead of jumping.
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContentHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [view]);

  const sourceSlug: FlavourSlug =
    FLAVOURS.find((f) => f.theme === theme)?.slug ?? FLAVOURS[0].slug;

  const runNav = (id: string) => scrollToId(id);
  const runRoute = (href: string) => router.push(href);

  const commands: CommandDef[] = useMemo(() => {
    const jump: CommandDef[] = [
      {
        id: "jump-shop",
        label: "Shop",
        description: "Jump to the flavour grid",
        keywords: ["shop", "buy", "flavours"],
        group: "Jump to",
        tone: "marigold",
        icon: "✱",
        closesOnSelect: true,
        onSelect: () => runNav("shop"),
      },
      {
        id: "jump-store-locator",
        label: "Store Locator",
        description: "Find a stockist near you",
        keywords: ["store", "locator", "near me", "stockist"],
        group: "Jump to",
        tone: "peacock",
        icon: "✱",
        closesOnSelect: true,
        onSelect: () => runRoute("/store-locator"),
      },
      {
        id: "jump-about",
        label: "About Us",
        description: "Who's behind hey.",
        keywords: ["about", "story", "team"],
        group: "Jump to",
        tone: "indigo",
        icon: "✱",
        closesOnSelect: true,
        onSelect: () => runRoute("/about"),
      },
      {
        id: "jump-ingredients",
        label: "Ingredients",
        description: "What's actually in the tin",
        keywords: ["ingredients", "nutrition", "makhana"],
        group: "Jump to",
        tone: "rani",
        icon: "✱",
        closesOnSelect: true,
        onSelect: () => runNav("ingredients"),
      },
      {
        id: "jump-mascots",
        label: "Meet the mascots",
        description: "The four faces of hey.",
        keywords: ["mascots", "characters", "meet"],
        group: "Jump to",
        tone: "jaadu",
        icon: "✱",
        closesOnSelect: true,
        onSelect: () => runNav("mascots"),
      },
    ];

    const flavours: CommandDef[] = FLAVOURS.map((flavour: Flavour) => ({
      id: `flavour-${flavour.slug}`,
      label: flavour.name,
      description: flavour.desc,
      keywords: flavour.keywords,
      group: "Flavours",
      tone: flavour.theme,
      icon: <MascotAvatar flavour={flavour.theme} size={20} />,
      closesOnSelect: true,
      onSelect: () => {
        setTheme(flavour.theme);
        scrollToId("flavours");
      },
    }));

    const actions: CommandDef[] = [
      {
        id: "action-notify",
        label: "Notify me →",
        description: "Get an email the day this drops",
        keywords: ["notify", "waitlist", "email", "launch"],
        group: "Actions",
        tone: "accent",
        icon: "✱",
        shortcut: "⏎",
        closesOnSelect: false,
        onSelect: () => setView("notify"),
      },
      {
        id: "action-copy-code",
        label: "Copy discount code",
        description: DISCOUNT_CODE,
        keywords: ["discount", "code", "coupon", "copy"],
        group: "Actions",
        tone: "marigold",
        icon: "✱",
        closesOnSelect: true,
        onSelect: () => {
          navigator.clipboard?.writeText(DISCOUNT_CODE).catch(() => {});
          toast({ message: "copied ✱", tone: "success" });
        },
      },
      {
        id: "action-contact",
        label: "Contact us",
        description: "hello@heymakhana.com",
        keywords: ["contact", "email", "support", "help"],
        group: "Actions",
        tone: "indigo",
        icon: "✱",
        closesOnSelect: true,
        onSelect: () => {
          window.location.href = "mailto:hello@heymakhana.com";
        },
      },
    ];

    const themeRows: CommandDef[] = [
      ...FLAVOURS.map((flavour) => ({
        id: `theme-${flavour.theme}`,
        label: `Theme: ${flavour.short}`,
        description: `Recolour the site to ${flavour.name}`,
        keywords: ["theme", "colour", "color", ...flavour.keywords],
        group: "Theme" as const,
        tone: flavour.theme as Tone,
        icon: <MascotAvatar flavour={flavour.theme} size={20} />,
        closesOnSelect: true,
        onSelect: () => setTheme(flavour.theme),
      })),
      {
        id: "theme-night",
        label: "Theme: Night mode",
        description: night ? "Currently on — switch back to day" : "Ink background, paper text",
        keywords: ["night", "dark", "mode", "theme"],
        group: "Theme",
        tone: "night",
        icon: "✱",
        closesOnSelect: true,
        onSelect: () => setNight(!night),
      },
      {
        id: "theme-sound",
        label: `Sound: ${soundEnabled ? "On" : "Off"}`,
        description: "Toggle interface sound effects",
        keywords: ["sound", "audio", "mute", "toggle"],
        group: "Theme",
        tone: "peacock",
        icon: "✱",
        closesOnSelect: true,
        onSelect: () => toggleSound(),
      },
    ];

    return [...jump, ...flavours, ...actions, ...themeRows];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, night, soundEnabled, setTheme, setNight, toggleSound, toast, router]);

  const commandsById = useMemo(() => new Map(commands.map((c) => [c.id, c])), [commands]);
  const recentCommands = recentIds.map((id) => commandsById.get(id)).filter((c): c is CommandDef => Boolean(c));

  // Debounced polite announcement of result count as the query changes —
  // separate from cmdk's own fuzzy filtering, just for the live region.
  useEffect(() => {
    const visibleCount = commands.filter((c) => matchesQuery(c, search)).length;
    const timer = setTimeout(() => {
      setAnnouncement(
        search.trim() === ""
          ? ""
          : visibleCount === 0
            ? "No results"
            : `${visibleCount} result${visibleCount === 1 ? "" : "s"}`
      );
    }, ANNOUNCE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search, commands]);

  const runCommand = (command: CommandDef) => {
    command.onSelect();
    addRecent(command.id);
    if (command.closesOnSelect) onOpenChange(false);
  };

  const handleNotifySuccess = (_result: NotifyResult, chosenSlug: FlavourSlug) => {
    const tone = FLAVOURS.find((f) => f.slug === chosenSlug)?.theme ?? "pataka";
    setSuccessTone(tone);
    setView("success");
    setTimeout(() => onOpenChange(false), SUCCESS_HOLD_MS);
  };

  const mockNotifySubmit = async (payload: NotifyPayload): Promise<NotifyResult> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { status: "created", ticket: "#2419", mergedFlavourSlugs: payload.flavourSlugs };
  };

  const groupOrder: CommandDef["group"][] = ["Jump to", "Flavours", "Actions", "Theme"];

  // Tab cycles between groups (jumps the highlight to the next group's
  // first row) instead of the browser's default field-to-field tabbing —
  // there's nothing else focusable inside the panel to tab to anyway, the
  // list itself is the whole interface. Dispatching a pointermove on the
  // target row is what actually moves cmdk's internal selection; there's no
  // public API for "select this item" from outside the component.
  const handleTabCycle = (event: KeyboardEvent) => {
    if (event.key !== "Tab" || view !== "list") return;
    const list = listRef.current;
    if (!list) return;
    event.preventDefault();
    const groups = Array.from(list.querySelectorAll<HTMLElement>('[cmdk-group=""]')).filter(
      (g) => !g.hidden
    );
    if (groups.length === 0) return;
    const selected = list.querySelector<HTMLElement>('[cmdk-item=""][aria-selected="true"]');
    const currentGroup = selected?.closest<HTMLElement>('[cmdk-group=""]') ?? null;
    const currentIndex = currentGroup ? groups.indexOf(currentGroup) : -1;
    const direction = event.shiftKey ? -1 : 1;
    const nextGroup = groups[(currentIndex + direction + groups.length) % groups.length];
    const nextItem = nextGroup.querySelector<HTMLElement>('[cmdk-item=""]');
    nextItem?.dispatchEvent(new PointerEvent("pointermove", { bubbles: true }));
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="hey. command palette"
      shouldFilter={view === "list"}
      className={styles.dialog}
      overlayClassName={styles.overlay}
      contentClassName={styles.content}
      onKeyDown={handleTabCycle}
    >
      <div
        className={styles.morphWrapper}
        style={contentHeight !== undefined ? { height: contentHeight } : undefined}
      >
        <div ref={contentRef}>
          {view === "list" && (
            <>
              <div className={styles.searchRow}>
                <span className={styles.cursor} aria-hidden="true">
                  ▮
                </span>
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  className={styles.input}
                  placeholder='type a flavour, a page, or "spicy"...'
                />
              </div>

              <Command.List ref={listRef} className={styles.list}>
                <Command.Empty className={styles.empty}>
                  <div className={styles.emptyMascots} aria-hidden="true">
                    {FLAVOURS.map((f) => (
                      <MascotAvatar key={f.slug} flavour={f.theme} size={32} expression="idle" />
                    ))}
                  </div>
                  <p>Kuch nahi mila. Try &quot;peri&quot;.</p>
                </Command.Empty>

                {recentCommands.length > 0 && (
                  <Command.Group heading="RECENT" className={styles.group}>
                    {recentCommands.map((command) => (
                      <Row
                        key={`recent-${command.id}`}
                        value={`${command.label} ${command.description} — recent`}
                        keywords={command.keywords}
                        command={command}
                        onRun={() => runCommand(command)}
                      />
                    ))}
                  </Command.Group>
                )}

                {groupOrder.map((groupName) => (
                  <Command.Group key={groupName} heading={groupName} className={styles.group}>
                    {commands
                      .filter((c) => c.group === groupName)
                      .map((command) => (
                        <Row
                          key={command.id}
                          value={`${command.label} ${command.description}`}
                          keywords={command.keywords}
                          command={command}
                          onRun={() => runCommand(command)}
                        />
                      ))}
                  </Command.Group>
                ))}
              </Command.List>

              <div className={styles.liveRegion} role="status" aria-live="polite">
                {announcement}
              </div>
            </>
          )}

          {view === "notify" && (
            <div className={styles.notifyWrap}>
              <h2 className={styles.notifyHeading}>Notify me</h2>
              <NotifyForm
                layout="compact"
                sourceSlug={sourceSlug}
                flavours={FLAVOURS}
                getTurnstileToken={async () => "palette-token"}
                onSubmit={mockNotifySubmit}
                onSuccess={(result) => handleNotifySuccess(result, sourceSlug)}
              />
            </div>
          )}

          {view === "success" && (
            <div className={styles.successPanel} data-tone={successTone}>
              <Grain scope="panel" intensity="subtle" />
              <span className={styles.successGlyph} aria-hidden="true">
                ✱
              </span>
              <p>you&apos;re in.</p>
            </div>
          )}
        </div>
      </div>
    </Command.Dialog>
  );
}

function Row({
  command,
  value,
  keywords,
  onRun,
}: {
  command: CommandDef;
  value: string;
  keywords?: string[];
  onRun: () => void;
}) {
  return (
    <Command.Item
      value={value}
      keywords={keywords}
      onSelect={onRun}
      data-tone={command.tone}
      className={styles.row}
    >
      <span className={styles.colourBar} aria-hidden="true" />
      <span className={styles.rowIcon} aria-hidden="true">
        {command.icon}
      </span>
      <span className={styles.rowText}>
        <span className={styles.rowLabel}>{command.label}</span>
        <span className={styles.rowDescription}>{command.description}</span>
      </span>
      {command.shortcut && (
        <Pill variant="kbd" className={styles.rowShortcut}>
          {command.shortcut}
        </Pill>
      )}
    </Command.Item>
  );
}
