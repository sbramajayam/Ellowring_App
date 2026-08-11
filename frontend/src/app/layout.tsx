import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme-context";

/** Single collage font family (screenshots use one sans-serif; hierarchy = weight/size only) */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en" className={`${jakarta.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Runtime config last — must win over build embed; ?v busts CDN/browser cache */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ELLOWRING_API_URL__=${JSON.stringify(apiUrl)};`,
          }}
        />
        <script src={`${base}/runtime-config.js?v=20260811-tunnel3`} />
      </head>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <I18nProvider>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
