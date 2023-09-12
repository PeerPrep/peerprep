import Image from "next/image";
import Button from "./components/button/Button";

export default function Home() {
  return (
    <main>
      <Image
        src="/backdrop.jpg"
        alt="backdrop"
        className="-z-10 opacity-50"
        layout="fill"
      />
      <section className="flex flex-col items-center py-24 lg:py-36 px-24 gap-4 z-20">
        <h1 className="text-5xl text-white font-bold text-center m-5 lg:text-7xl">
          Streamlining Technical Interview Preparation.
        </h1>
        <h2 className="text-xl text-center text-white font-medium">
          Collaborative mock interviews to boost your confidence and nail your
          dream job interviews.
        </h2>
        <Button
          className="btn-accent w-36 m-2"
          children={<span>Get Started!</span>}
        />
      </section>
    </main>
  );
}
