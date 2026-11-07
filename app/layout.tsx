import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Manufacturing Automation Readiness Assessment",
  description:
    "Answer 10 questions to get your Manufacturing Automation Readiness Score, key opportunities and a personalised recommendation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        {children}
        {/* Google Tag Manager (GTM-52ZSNWZF) */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});`}
        </Script>
        <Script id="gtm" src="https://www.googletagmanager.com/gtm.js?id=GTM-52ZSNWZF" strategy="afterInteractive" />
      </body>
    </html>
  );
}
