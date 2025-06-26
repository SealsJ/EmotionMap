import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ToastProvider } from "./toast/ToastProvider";

const myFont = Montserrat({
  weight: ["100", "200","300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--my-font-family",
});

export const metadata: Metadata = {
  title: "EmotionMap",
  description: "A tool that augments how people envideos by revealing and letting them interact with its emotional structure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
      <html lang="en" className={myFont.variable}>
        <body>
          <Navbar />
          <main>
            {children}
          </main>
        </body>
      </html>
    </ToastProvider>
  );
}
