"use client";
import Button from "../components/button/Button";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import { AiFillGithub } from "@react-icons/all-files/ai/AiFillGithub";

import { signInWithRedirect } from "firebase/auth";
import {
  auth,
  githubProvider,
  googleProvider,
} from "../../libs/firebase-config";
import useRedirectLogin from "../hooks/useRedirectLogin";

const roomPage = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <section className="flex h-[30svh] flex-col items-center justify-center gap-4 rounded-md bg-white px-12 shadow-md">
        <h1 className="text-lg font-semibold text-black">Login with</h1>
        <div className="flex gap-2">
          <Button
            className="bg-blue-500 px-4 hover:bg-blue-600 focus:bg-blue-700"
            onClick={() => signInWithRedirect(auth, googleProvider)}
          >
            <FcGoogle className="text-xl" />
            Google
          </Button>
          <Button
            className="bg-primary px-4"
            onClick={() => signInWithRedirect(auth, githubProvider)}
          >
            <AiFillGithub className="text-xl" />
            GitHub
          </Button>
        </div>
      </section>
    </div>
  );
};

export default roomPage;
