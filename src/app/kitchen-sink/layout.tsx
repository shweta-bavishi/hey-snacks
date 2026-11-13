import { CommandPaletteProvider } from "@/components/command-palette/CommandPaletteProvider";

// The command palette is off the landing page (see docs/landing-page-plan.md
// §1.4) but the kitchen-sink still needs a provider in its tree for
// command-palette-story.tsx to call useCommandPalette(). Scoping it here,
// rather than at the app root, keeps ⌘K from firing anywhere else.
export default function KitchenSinkLayout({ children }: LayoutProps<"/kitchen-sink">) {
  return <CommandPaletteProvider>{children}</CommandPaletteProvider>;
}
