import type { Metadata } from "next";
import SayHi from "@/components/SayHi";
import SettingsPanel from "@/components/SettingsPanel";
import {
  Inter,
  Cormorant_Garamond,
  Nunito,
  Fraunces,
  Archivo_Black,
  Bungee,
  DM_Mono,
  DM_Sans,
  Instrument_Serif,
  Courier_Prime,
  Archivo,
  Fredoka,
} from "next/font/google";
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

const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bungee = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const archivoVar = Archivo({
  variable: "--font-archivo-var",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const courierPrime = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lucasxie.me"),
  title: "Lucas Xie",
  description: "Lucas Xie designs apps and websites. Case studies from useno, sponty, spark, grove and alvarez.",
  openGraph: {
    title: "Lucas Xie",
    description: "i design apps and websites.",
    url: "/",
    siteName: "Lucas Xie",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
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
      className={`${inter.variable} ${cormorant.variable} ${fraunces.variable} ${nunito.variable} ${archivoBlack.variable} ${bungee.variable} ${dmMono.variable} ${dmSans.variable} ${instrumentSerif.variable} ${courierPrime.variable} ${archivoVar.variable} ${fredoka.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Page-wide ambient gradient — bleeds through all sections */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
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
        {children}
        <SettingsPanel />
        <SayHi />
      </body>
    </html>
  );
}
