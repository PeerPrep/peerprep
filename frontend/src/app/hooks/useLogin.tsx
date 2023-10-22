"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../libs/firebase-config";
import { useRouter } from "next/navigation";
import { FetchAuth, fetchProfileUrl } from "../api";

export interface Profile {
  uid: string;
  name: string | null;
  imageUrl: string | null;
  preferredLang: string | null;
  role: string;
};

function useLogin(init: (profile: Profile) => any): [Profile | null, Dispatch<SetStateAction<Profile | null>>] {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);

  const getProfile = async (user: User) => {
    const token = await user.getIdToken();
    FetchAuth.addFirebaseToken(token);
    const res = await fetchProfileUrl();
    setProfile(res.payload);
    init(res.payload);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getProfile(user);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return [ profile, setProfile ];
};

export default useLogin;
