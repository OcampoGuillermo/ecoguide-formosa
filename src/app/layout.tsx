import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Providers } from "@/components/providers";

const archivo = localFont({
  src: [{ path: "../fonts/Archivo-Variable.ttf", style: "normal" }],
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const azeret = localFont({
  src: [{ path: "../fonts/AzeretMono-Variable.ttf", style: "normal" }],
  variable: "--font-azeret",
  weight: "100 900",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "EcoGuide Formosa — Turismo Regional & Naturaleza",
    template: "%s | EcoGuide Formosa",
  },
  description:
    "Mapa, audioguías de guías locales, escáner QR y rutas ecoturísticas de la provincia de Formosa. Funciona sin conexión, en el lugar y en el sendero.",
  keywords: [
    "Formosa",
    "ecoturismo",
    "reservas naturales",
    "audioguías",
    "rutas",
    "turismo sostenible",
    "Parque Nacional Ibirapuitá",
  ],
  authors: [{ name: "EcoGuide Formosa" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "EcoGuide Formosa",
    title: "EcoGuide Formosa — Turismo Regional & Naturaleza",
    description:
      "Mapa, audioguías de guías locales y rutas ecoturísticas de Formosa. Todo funciona sin señal.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoGuide Formosa",
    description: "Turismo regional y naturaleza de Formosa, sin señal y en el lugar.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EADEC0" },
    { media: "(prefers-color-scheme: dark)", color: "#19323C" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * El tema se fija antes del primer pintado para que el papel no parpadee.
 * La app arranca en claro por defecto: se lee a pleno sol, en el lugar.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("ecoguide-theme");
    var dark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${azeret.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="EcoGuide" />
        <Script id="tema" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className="min-h-dvh sheet antialiased">
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
