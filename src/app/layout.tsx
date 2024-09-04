import type { Metadata } from "next";
import josefin_sans from "@/utils/fonts";
import "@/app/global.scss";

export const metadata: Metadata = {
  title: "MMM...Movies",
  description: "Movie Tracking Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={josefin_sans.className}>{children}</body>
    </html>
  );
}
