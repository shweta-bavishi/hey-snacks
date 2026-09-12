import type { Metadata } from "next";
import { Hind, Modak, Rozha_One, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { DEFAULT_THEME, themeInitScript } from "@/components/theme/theme-script";
import { Grain } from "@/components/grain/Grain";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { CommandPaletteProvider } from "@/components/command-palette/CommandPaletteProvider";

// Variable names are distinct from the --font-* tokens in tokens.css
// (which layer in the fallback stacks) so cascade order between the
// next/font style tag and tokens.css can never flip which one wins.
const fontBody = Hind({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fontDisplay = Rozha_One({
  variable: "--font-rozha",
  subsets: ["latin"],
  weight: "400",
});

const fontChunky = Modak({
  variable: "--font-modak",
  subsets: ["latin"],
  weight: "400",
});

const fontMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "hey.",
  description: "Roasted in Bihar. Ruined for anything else.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      data-night="false"
      className={`${fontBody.variable} ${fontDisplay.variable} ${fontChunky.variable} ${fontMono.variable} h-full antialiased`}
    >
      <head>
        {/* Blocking, runs before hydration — no flash of wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Modal marks this inert while open, so every Modal user needs it —
            the portal itself renders as a body sibling, outside this root. */}
        <div id="app-root" className="min-h-full flex flex-col">
          <Grain />
          <ThemeProvider>
            <ToastProvider>
              <CommandPaletteProvider>{children}</CommandPaletteProvider>
            </ToastProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
