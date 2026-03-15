import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentsEid — Personalize Your Design",
  description:
    "Choose a design, enter your name, and download a personalized image.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-alt text-text min-h-screen">{children}</body>
    </html>
  );
}
