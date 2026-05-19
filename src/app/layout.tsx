import type { Metadata } from "next";
import { Inter, Pacifico } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n/context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  weight: "400",
  variable: "--font-pacifico",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel Candy Rose",
  description: "Boutique Hotel in Panama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className={`${inter.variable} ${pacifico.variable} font-sans min-h-full flex flex-col`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
