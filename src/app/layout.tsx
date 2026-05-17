import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { AuthProvider } from "@/components/auth-provider";
import { ProductCatalogProvider } from "@/components/product-catalog-provider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://editins.com"),
  title: {
    default: "Editins - Edit Digital Instan Tanpa ke Studio",
    template: "%s | Editins",
  },
  description:
    "Edit digital instan tanpa ke studio. Editins membantu UMKM membuat foto produk, hapus background, banner promo, dan pantau riwayat hasil.",
  icons: {
    icon: "/logo-cropped.png",
    shortcut: "/logo-cropped.png",
    apple: "/logo-cropped.png",
  },
  openGraph: {
    title: "Editins - Edit Digital Instan Tanpa ke Studio",
    description: "Buat foto produk, hapus background, dan banner promo untuk jualan UMKM Indonesia.",
    images: ["/logo-cropped.png"],
    siteName: "Editins",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    try {
      const savedTheme = localStorage.getItem('editins-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      document.documentElement.classList.toggle('dark', shouldUseDark);
      document.documentElement.style.colorScheme = shouldUseDark ? 'dark' : 'light';
    } catch (_) {}
  `;

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ProductCatalogProvider>{children}</ProductCatalogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
