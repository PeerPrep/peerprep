"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../libs/firebase-config";
import { useRouter } from "next/navigation";

export interface Profile {
  uid: string;
  name: string | null;
  imageUrl: string | null;
  preferredLang: string | null;
  role: string;
}

const useLogin = () => {
  const [user, setUser] = useState<any>(null); // State to store the user object

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // If a user is authenticated, update the user state
        setUser(authUser);
      } else {
        // If there is no authenticated user, set the user state to null
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return user; // Return the user object or null
};

export default useLogin;
