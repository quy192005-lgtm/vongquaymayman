import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lucky Wheel - Spin the Wheel of Fortune & Win Prizes",
  description: "A modern, responsive, and customizable Lucky Wheel web application. Pick random winners, make decisions, and customize prizes with sound effects and confetti celebrations.",
  keywords: ["lucky wheel", "spin the wheel", "wheel of fortune", "random picker", "decision maker", "raffle", "giveaway"],
  authors: [{ name: "Lucky Wheel" }],
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
