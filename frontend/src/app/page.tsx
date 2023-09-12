import Image from "next/image";
import Button from "./components/button/Button";

export default function Home() {
  return (
    <main>
      <Image
        src="/backdrop.jpg"
        alt="backdrop"
        className="-z-10 opacity-50"
        fill
      />
      <section className="flex flex-col items-center py-36 px-24 gap-4 z-20">
        <h1 className="text-7xl text-white font-bold text-center">
          Let's Prep Together!
        </h1>
        <h2 className="text-xl text-center text-white font-medium max-w-xl">
          Collaborative Mock Interviews to Boost Your Confidence and Nail Your
          Dream Job Interviews
        </h2>
        <Button
          className="btn-accent w-36"
          children={<span>Get Started!</span>}
        />
      </section>
    </main>
  );
}
