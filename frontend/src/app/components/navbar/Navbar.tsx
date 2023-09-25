"use client";

import { auth } from "@/libs/firebase-config";
import { User, onAuthStateChanged, signOut, getAuth } from "@firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoPeopleCircleSharp } from "react-icons/io5";
import Button from "../button/Button";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  // useEffect(() => {
  //   getRedirectResult(auth).then(async (userCred) => {
  //     console.log({ userCred });
  //     setUser(userCred);
  //   });
  // }, []);

  const onClickLogout = async () => {
    const auth = await getAuth();
    router.push("/");
    await signOut(auth);
    console.log(user);
  };
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log({ user });
      setUser(user);
    } else {
      setUser(null);
    }
  });
  return (
    <nav>
      <div className="flex items-center justify-between bg-neutral p-2 px-16">
        <div className="flex items-center text-3xl font-bold text-white">
          <Link href="/">
            <IoPeopleCircleSharp className="cursor-pointer text-5xl text-base-100" />
          </Link>
          PeerPrep
        </div>

        {user ? (
          <div className="dropdown dropdown-hover">
            <label tabIndex={0}>
              <div className="btn-secondary flex items-center gap-1 rounded-md p-1">
                <RiArrowDropDownLine className="text-4xl" />
                <span className="mr-4 text-lg font-bold">
                  {user?.displayName}
                </span>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content btn-primary rounded-box z-[1] w-48 p-2 shadow"
            >
              <li>
                <button onClick={onClickLogout} className="flex">
                  <FiLogOut />
                  <span className="font-medium text-white">Logout</span>
                </button>
              </li>
            </ul>
          </div>
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
