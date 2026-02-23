import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeCheck — Do You Really Know Each Other?",
  description:
    "Pick your favorites, challenge your partner to guess, and discover your Vibe-Sync score. The ultimate couples compatibility game.",
  openGraph: {
    title: "VibeCheck — Do You Really Know Each Other?",
    description:
      "Pick your favorites, challenge your partner to guess, and discover your Vibe-Sync score.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
