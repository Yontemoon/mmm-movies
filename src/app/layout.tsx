import type { Metadata } from "next";
import josefin_sans from "@/utils/fonts";
import "@/app/global.scss";
import Header from "@/components/header/Header";
import ReactQueryProvider from "@/context/ReactQueryProvider";
import UserMoviesProvider from "@/context/UserMoviesProvider";
import ToastProvider from "@/context/toast/ToastProvider";

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
      <ReactQueryProvider>
        <UserMoviesProvider>
          <ToastProvider>
            <body className={josefin_sans.className}>
              <Header />
              <main>{children}</main>
            </body>
          </ToastProvider>
        </UserMoviesProvider>
      </ReactQueryProvider>
    </html>
  );
}
