import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Providers from "@/utils/provider";

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
        <div className="flex h-[100svh] flex-col">
          <div className="grow">
            <Providers>{children}</Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
