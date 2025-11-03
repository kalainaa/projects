// src/app/chatting/[chatId]/page.js

"use client"; // This makes the component a client component

import { useRef } from "react";
import ChatPage from "@/components/Chat/chatPage/chatPage";
import ChatHistory from "@/components/ChatHistory/history/chatHistory/chatHistory";
import style from "./page.module.css";
import ReferencePage from "@/components/Reference/referencePage/referencePage";
import UserPreferencePage from "@/components/UserPreferences/userPreferencePage/userPreferencePage";
import SessionTimer from "@/components/Utils/sessionTimeout/sessionTimer/sessionTimer";
import PreLoader from "@/components/Utils/preLoader/preLoader";
import Navbar from "@/components/Navbar/navbar";

export default function Chatting() {
  // -- Refs --
  const pageRef = useRef(null);
  // -- end Refs --

  return (
    <main className={style.overall} ref={pageRef}>
      <SessionTimer />
      <Navbar />
      <ChatPage
        ignoreCancerTypeSelection={true}
        backgroundStyle={{ paddingBottom: "var(--spacing-big)" }}
        autoScroll={false}
      />
      <ChatHistory />
      <UserPreferencePage />
      <ReferencePage pageRef={pageRef} />
      <PreLoader />
    </main>
  );
}
