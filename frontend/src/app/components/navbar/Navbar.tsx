"use client";

import { FetchAuth } from "@/app/api";
import { auth } from "@/libs/firebase-config";
import { User, getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import { AiFillSetting } from "@react-icons/all-files/ai/AiFillSetting";
import { IoPeopleCircleSharp } from "@react-icons/all-files/io5/IoPeopleCircleSharp";
import { RiArrowDropDownLine } from "@react-icons/all-files/ri/RiArrowDropDownLine";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import Button from "../button/Button";
import NavbarPane from "./NavbarPane";
import NavbarPaneDropdown from "./NavbarPaneDropdown";

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
    localStorage.removeItem("user");
    console.log(user);
  };
  onAuthStateChanged(auth, (user) => {
    getAuth()
      .currentUser?.getIdToken(true)
      .then(function (idToken) {
        FetchAuth.addFirebaseToken(idToken);
        localStorage.setItem("user", JSON.stringify(idToken));
      });

    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  const handleBlur = () => {
    const elem: any = document.activeElement;
    if (elem) {
      elem?.blur();
    }
  };

  return (
    <nav>
      <div className="flex items-center justify-between bg-neutral px-16 shadow-md">
        <nav className="flex items-center gap-1">
          <div className="mr-6 flex items-center text-3xl font-bold text-white">
            <Link href="/matching">
              <IoPeopleCircleSharp className="cursor-pointer text-5xl text-base-100" />
            </Link>
            PeerPrep
          </div>
          {user && (
            <>
              <NavbarPane link="/matching" label="Matching" />
              <NavbarPaneDropdown
                mainLabel="Admin"
                navElements={[
                  { link: "/admin/portal", label: "Portal" },
                  { link: "/admin/question", label: "Question" },
                ]}
              />
            </>
          )}
        </nav>
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
                <button
                  onClick={() => {
                    router.push("/settings");
                    handleBlur();
                  }}
                  className="flex"
                >
                  <AiFillSetting />
                  <span className="font-medium text-white">Settings</span>
                </button>
              </li>
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
