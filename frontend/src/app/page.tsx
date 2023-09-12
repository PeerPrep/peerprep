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
      <section className="flex flex-col items-center py-36 px-24 gap-4 z-20">
        <h1 className="text-7xl text-white font-bold text-center m-5 max-w-10xl">
          Streamlining Technical Interview Preparation.
        </h1>
        <h2 className="text-xl text-center text-white font-medium max-w-3xl m-5">
          Collaborative mock interviews to boost your confidence and nail your
          dream job interviews.
        </h2>
        <Button
          className="btn-accent w-36 m-6"
          children={<span>Get Started!</span>}
        />
      </section>
    </main>
  );
}
