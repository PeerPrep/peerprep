"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../libs/firebase-config";
import { useRouter, usePathname } from "next/navigation";

const useRedirectLogin = () => {
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && pathName !== "/") {
        router.push("/login");
      }
      if (user && pathName === "/login") {
        router.push("/matching");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [pathName]);
};

export default useRedirectLogin;
