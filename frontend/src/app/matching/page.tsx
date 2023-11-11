"use client";

import Button from "@/app/components/button/Button";
import { Space } from "antd";
import { getAuth } from "firebase/auth";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { FetchAuth } from "../api";
import QuestionModal from "../components/modal/QuestionModal";
type UserDetails = { displayName: string; authToken: string };
const userDetailsAtom = atom<UserDetails | null>(null);

import { useState } from "react";
import QueueButton from "../components/button/QueueButton";
import Loading from "../loading";
import { useQuery } from "@tanstack/react-query";
import { QuestionType } from "../admin/question/page";

const roomPage = () => {
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  useEffect(() => {
    FetchAuth.getFirebaseToken().then((authToken) => {
      const displayName = getAuth().currentUser?.displayName ?? "Anonymous";
      setUserDetails({ displayName, authToken });
    });
  }, []);

  if (!userDetails) {
    return (
      <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
        <h1 className="text-4xl font-bold">Checking your login status...</h1>
      </section>
    );
  }

  return (
    <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
      <h1 className="text-4xl font-bold">
        Welcome, {userDetails.displayName}!
      </h1>
      <Space>
        <QuestionModal />
      </Space>
    </section>
  );
};

export default roomPage;
