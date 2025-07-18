import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "qu1cksave",
  description: "App to track your job applications more efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 
        Properly change favicon (icon on tabs):
        https://www.reddit.com/r/nextjs/comments/1834gp9/faviconico_in_app_folder_but_not_rendering_on/
      */}
      <head>
        <link rel="icon" href="/images/icon.ico" sizes="any" />
      </head>
      <AppRouterCacheProvider>
        <body className={inter.className} style={{backgroundColor: '#1e1e1e'}} >{children}</body>
      </AppRouterCacheProvider>
    </html>
  );
}
