"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../libs/firebase-config";
import { useRouter } from "next/navigation";
import { fetchProfileUrl } from "../api";

export interface Profile {
  uid: string;
  name: string | null;
  imageUrl: string | null;
  preferredLang: string | null;
  role: string;
};

const dummyProfile = { uid: "", name: null, imageUrl: null, preferredLang: null, role: "" };

function useLogin(init: (profile: Profile) => any): [string, Profile, Dispatch<SetStateAction<Profile>>] {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [profile, setProfile] = useState<Profile>(dummyProfile);

  const getProfile = async (user: User) => {
    const token = await user.getIdToken();
    const res = await fetchProfileUrl(token);
    setToken(token);
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

  return [ token, profile, setProfile ];
};

export default useLogin;
