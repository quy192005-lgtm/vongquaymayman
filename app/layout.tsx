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
    "vòng quay ngẫu nhiên",
    "spin the wheel",
  ],
  authors: [{ name: "Vòng Quay May Mắn" }],
  metadataBase: new URL("https://vongquaymayman247.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vòng Quay May Mắn - Trò chơi quay thưởng trực tuyến",
    description:
      "Tham gia vòng quay may mắn online miễn phí, tự thiết lập giải thưởng, quay thưởng vui nhộn, nhận ngay các phần quà hấp dẫn và mã giảm giá.",
    url: "https://vongquaymayman247.vercel.app/",
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

// Cấu trúc dữ liệu JSON-LD giúp Google hiểu rõ website là ứng dụng minigame
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Vòng Quay May Mắn - Trò chơi quay thưởng trực tuyến",
  "url": "https://vongquaymayman247.vercel.app/",
  "description":
    "Tham gia vòng quay may mắn online miễn phí, tự thiết lập giải thưởng, quay thưởng vui nhộn, nhận ngay các phần quà hấp dẫn và mã giảm giá.",
  "applicationCategory": "GameApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "VND",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Adsterra Social Bar Ad Script (Chèn trực tiếp vào head để load ngay lập tức) */}
        <script
          data-cfasync="false"
          src="https://bicea.org/14/3a10b2ec5f8fe68ea2ef7d680bf24b3c"
        />
      </head>
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
