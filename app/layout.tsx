import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
import SettingsPanel from "@/components/SettingsPanel";
import { Inter, Cormorant_Garamond, Nunito, Fraunces } from "next/font/google";
import "./globals.css";

const themeInitScript = `(function () {
  try {
    var stored = JSON.parse(localStorage.getItem("site-settings") || "{}");
    var theme = stored.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var reducedMotion = stored.reducedMotion ?? matchMedia("(prefers-reduced-motion: reduce)").matches;
    var root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    if (reducedMotion) root.classList.add("reduce-motion");
    if (stored.textSize) root.setAttribute("data-text-size", stored.textSize);
  } catch (e) {}
})();`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400"],
  style: ["normal", "italic"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lucas Xie — Portfolio",
  description: "Helping early-stage ideas find traction and grow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${fraunces.variable} ${nunito.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Page-wide ambient gradient — bleeds through all sections */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute top-0 right-0 w-[120vw] h-[120vh]"
            style={{
              background:
                "radial-gradient(ellipse at 90% 5%, rgba(200,175,145,0.25) 0%, rgba(220,150,130,0.10) 12%, rgba(150,190,200,0.04) 22%, transparent 32%)",
            }}
          />
          <div
            className="absolute top-1/3 left-0 w-[80vw] h-[80vh]"
            style={{
              background:
                "radial-gradient(ellipse at 5% 50%, rgba(220,195,155,0.14) 0%, rgba(215,190,150,0.05) 45%, transparent 65%)",
            }}
          />
        </div>
        <Cursor />
        {children}
        <SettingsPanel />
      </body>
    </html>
  );
}
