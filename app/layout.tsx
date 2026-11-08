import type { Metadata } from "next";
import { Eczar, Mukta } from "next/font/google";
import "./globals.css";

// Eczar and Mukta are typefaces designed in India, for Latin and Devanagari.
const eczar = Eczar({
  variable: "--font-eczar",
  subsets: ["latin", "devanagari"],
});

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Chanakya",
  description: "Your personal planner",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${eczar.variable} ${mukta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
