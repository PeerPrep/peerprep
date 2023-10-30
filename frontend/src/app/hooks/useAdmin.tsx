"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../libs/firebase-config";
import { useRouter } from "next/navigation";
import { fetchIsAdmin } from "../api";

export interface Profile {
  uid: string;
  name: string | null;
  imageUrl: string | null;
  preferredLang: string | null;
  role: string;
}

const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // If a user is authenticated, update the user state
        const isAdmin = await fetchIsAdmin();
        setIsAdmin(isAdmin);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return isAdmin;
};

export default useAdmin;
