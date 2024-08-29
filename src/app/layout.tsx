import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/Providers/reactQuery";

const inter = Inter({ subsets: ["latin"], variable: "--inter" });

const sfProText = localFont({
  variable: "--sfProText",
  src: [
    {
      path: "../../public/fonts/SF-Pro-Text-Font-Family/SF-Pro-Text-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Text-Font-Family/SF-Pro-Text-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/SF-Pro-Text-Font-Family/SF-Pro-Text-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Text-Font-Family/SF-Pro-Text-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/SF-Pro-Text-Font-Family/SF-Pro-Text-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Text-Font-Family/SF-Pro-Text-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/SF-Pro-Text-Font-Family/SF-Pro-Text-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Text-Font-Family/SF-Pro-Text-SemiboldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/SF-Pro-Text-Font-Family/SF-Pro-Text-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Text-Font-Family/SF-Pro-Text-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Techinnover",
  description: "Techinnover Task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sfProText.variable} font-inter`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
      <Toaster richColors />
    </html>
  );
}
