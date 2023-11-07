"use client";
import Image from "next/image";
import Button from "./components/button/Button";
import { useRouter } from "next/navigation";
import useRedirectLogin from "./hooks/useRedirectLogin";

export default function Home() {
  useRedirectLogin();
  return (
    <main className="h-full">
      <Image
        src="/backdrop.jpg"
        alt="backdrop"
        className="-z-10 opacity-50"
        layout="fill"
      />
      <section className="z-20 flex h-full flex-col items-center justify-center gap-4 px-24 py-24 lg:py-36">
        <h1 className="m-5 text-center text-5xl font-bold text-white lg:text-7xl">
          Streamlining Technical Interview Preparation.
        </h1>
        <h2 className="text-center text-xl font-medium text-white">
          Collaborative mock interviews to boost your confidence and nail your
          dream job interviews.
        </h2>
        <a href="/login">
          <Button
            className="btn-accent m-2 w-36"
            children={<span>Get Started!</span>}
          />
        </a>
      </section>
    </main>
  );
}
