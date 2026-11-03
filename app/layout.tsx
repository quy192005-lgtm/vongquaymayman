import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vòng Quay May Mắn - Trò chơi quay thưởng trực tuyến",
  description:
    "Tham gia vòng quay may mắn online miễn phí, tự thiết lập giải thưởng, quay thưởng vui nhộn, nhận ngay các phần quà hấp dẫn và mã giảm giá.",
  keywords: [
    "vòng quay may mắn",
    "lucky wheel online",
    "quay thưởng trực tuyến",
    "minigame vòng quay",
  ],
  authors: [{ name: "Vòng Quay May Mắn" }],
  metadataBase: new URL("https://vongquaymayman-navy.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vòng Quay May Mắn - Trò chơi quay thưởng trực tuyến",
    description:
      "Tham gia vòng quay may mắn online miễn phí, tự thiết lập giải thưởng, quay thưởng vui nhộn, nhận ngay các phần quà hấp dẫn và mã giảm giá.",
    url: "https://vongquaymayman-navy.vercel.app/",
    siteName: "Vòng Quay May Mắn",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vòng Quay May Mắn - Trò chơi quay thưởng trực tuyến",
    description:
      "Tham gia vòng quay may mắn online miễn phí, tự thiết lập giải thưởng, quay thưởng vui nhộn, nhận ngay các phần quà hấp dẫn và mã giảm giá.",
  },
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
    <html lang="vi" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
