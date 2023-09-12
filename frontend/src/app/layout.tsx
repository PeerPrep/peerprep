import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "./components/navbar/Navbar";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PeerPrep | Streamlining Technical Interview Preparation",
  description: "Practise!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="myTheme">
      <body className={montserrat.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
