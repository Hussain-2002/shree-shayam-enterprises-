import { Fraunces, Outfit } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Shree Shyam Enterprises",
    template: "%s — Shree Shyam Enterprises",
  },
  description:
    "Shree Shyam Enterprises is a demo shop for suits, shoes, bed sheets, kids’ clothes, and home things. Sample products and sample prices.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable}`}>
      <body>
        <CartProvider>
          <SiteShell>{children}</SiteShell>
        </CartProvider>
      </body>
    </html>
  );
}
