"use client";

import { auth } from "@/libs/firebase-config";
import { User, getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import { IoPeopleCircleSharp } from "@react-icons/all-files/io5/IoPeopleCircleSharp";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../button/Button";
import { RiArrowDropDownLine } from "@react-icons/all-files/ri/RiArrowDropDownLine";
import { AiFillSetting } from "@react-icons/all-files/ai/AiFillSetting";
import { FiLogOut } from "react-icons/fi";
import NavbarPane from "./NavbarPane";
import NavbarPaneDropdown from "./NavbarPaneDropdown";
import { FetchAuth, fetchProfileUrl } from "@/app/api";
import Image from "next/image";
import { BiUserCircle } from "@react-icons/all-files/bi/BiUserCircle";
import useAdmin from "@/app/hooks/useAdmin";
import useRedirectLogin from "@/app/hooks/useRedirectLogin";

const Navbar = () => {
  useRedirectLogin();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const { isAdmin, isLoading } = useAdmin();

  useEffect(() => {
    fetchProfileUrl().then((res) => {
      setProfileImageUrl(res.payload.imageUrl);
      setName(res.payload.name || "");
    });
  }, []);

  const onClickLogout = async () => {
    const auth = await getAuth();
    router.push("/");
    await signOut(auth);
  };
  onAuthStateChanged(auth, (user) => {
    getAuth()
      .currentUser?.getIdToken(true)
      .then(function (idToken) {
        FetchAuth.addFirebaseToken(idToken);
      })
      .then(() => {
        fetchProfileUrl();
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
              {isAdmin && (
                <NavbarPaneDropdown
                  mainLabel="Admin"
                  navElements={[
                    { link: "/admin/portal", label: "Portal" },
                    { link: "/admin/question", label: "Question" },
                  ]}
                />
              )}
            </>
          )}
        </nav>
        {user ? (
          <div className="dropdown dropdown-hover">
            <label tabIndex={0}>
              <div className="btn-secondary flex items-center gap-1 rounded-md p-1">
                <RiArrowDropDownLine className="text-4xl" />
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    className="aspect-square w-8 rounded-full border border-black"
                    width={32}
                    height={32}
                    alt="uploaded-image"
                  />
                ) : (
                  <BiUserCircle className="aspect-square w-8 text-2xl" />
                )}
                <span className="mr-4 max-w-[7rem] truncate text-lg font-bold">
                  {name}
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
