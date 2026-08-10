import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ellowring — Learn. Prepare. Build. Get Hired.",
  description:
    "From 11th Standard to First Job — India's AI-powered Education, Career & Hiring ecosystem.",
};

const API_DEFAULT = "http://localhost:4001/api/v1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || API_DEFAULT;

  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Inline boot config — avoids next/script client-render script tag errors. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ELLOWRING_API_URL__=${JSON.stringify(apiUrl)};`,
          }}
        />
        {/* Optional override file for deploy-time edits without rebuild. */}
        <script src={`${base}/runtime-config.js`} />
      </head>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <I18nProvider>
          <AuthProvider>{children}</AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
