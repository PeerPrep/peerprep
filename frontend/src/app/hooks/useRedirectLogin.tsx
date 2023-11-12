"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../libs/firebase-config";
import { useRouter, usePathname } from "next/navigation";
import { checkProfileUrl } from "../api";

const useRedirectLogin = () => {
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && pathName !== "/") {
        router.push("/login");
      }
      if (user && pathName === "/login") {
        router.push("/settings");
      }

      if (user && pathName === "/questions") {
        checkProfileUrl().then((res) => {
          if (res.payload.profileExists) {
            router.push("/settings");
          }
        });
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [pathName]);
};

export default useRedirectLogin;
