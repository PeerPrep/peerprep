"use client";

import { IoPeopleCircleSharp } from "react-icons/io5";
import Button from "../button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, getRedirectResult, onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/libs/firebase-config";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  // useEffect(() => {
  //   getRedirectResult(auth).then(async (userCred) => {
  //     console.log({ userCred });
  //     setUser(userCred);
  //   });
  // }, []);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log({ user });
      setUser(user);
    }
  });
  return (
    <nav>
      <div className="flex items-center justify-between bg-neutral p-2 px-12">
        <div className="flex items-center text-3xl font-bold text-white">
          <Link href="/">
            <IoPeopleCircleSharp className="cursor-pointer text-5xl text-base-100" />
          </Link>
          PeerPrep
        </div>
        {user ? (
          user?.displayName
        ) : (
          <Button
            className="btn-accent btn-sm rounded-full px-4"
            children={<span onClick={() => router.push("/login")}>Login</span>}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
