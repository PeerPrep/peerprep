import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import Providers from "@/utils/provider";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useEffect, useState } from "react";
import { User } from "@firebase/auth-types";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PeerPrep | Streamlining Technical Interview Preparation",
  description: "Practise!",
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const app = initializeApp(firebaseConfig);
  if (typeof window !== "undefined") {
    const analytics = getAnalytics(app);
  }

  return (
    <html lang="en" data-theme="myTheme">
      <body className={montserrat.className}>
        <div className="flex h-[100svh] flex-col">
          <Navbar />
          <div className="grow">
            <Providers>{children}</Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
