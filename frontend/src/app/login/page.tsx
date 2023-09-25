"use client";
import Button from "../components/button/Button";

import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import {
  auth,
  githubProvider,
  googleProvider,
} from "../../libs/firebase-config";

const roomPage = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-4 p-6 lg:flex-row">
      <Button onClick={() => signInWithRedirect(auth, googleProvider)}>
        Login with Google
      </Button>
      <Button onClick={() => signInWithRedirect(auth, githubProvider)}>
        Login with GitHub
      </Button>
    </section>
  );
};

export default roomPage;
