"use client";

import ChatPage from "@/components/Chat/chatPage/chatPage";
import style from "./findTestPage.module.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { precisionMedicineSliceActions } from "@/redux/Slices/precisionMedicineSlice";
import { PrecisionMedicineChartTypes } from "@/redux/Slices/precisionMedicineSlice";

import {
  ChatType,
  chatSliceActions,
  ChatbotResponse,
} from "@/redux/Slices/chatSlice";
import { ChatState, globalSliceActions } from "@/redux/Slices/globalsSlice";
import { v4 as uuidv4 } from "uuid";
import { NavigationPathways } from "@/redux/Slices/navigationSlice";
import { useSelector } from "react-redux";
import { navigationSliceActions } from "@/redux/Slices/navigationSlice";
import { usePathname } from "next/navigation";

/**
 *  This component is used to display the Find Test Page
 *  It is used to render all the components that are needed to find a test in the chatbot
 */
export default function FindTestPage() {
  // -- Redux Global State --
  const navigationSlice = useSelector((state) => state.navigationSlice);
  const dispatch = useDispatch();
  //  -- end Redux Global State --

  // -- NextJS Router --
  const pathname = usePathname();
  // -- end NextJS Router --

  /**
   * This function is used to determine if the user is on the Find Test Page
   * If the user is on the Find Test Page, then the chatbot will be locked out
   * The user will be prompted to narrow down their search by selecting certain filters - indicated by the chatType.precisionMedicineFilters
   *
   * Once the user has selected the filters, the user will be able to find the tests and the chatbot will be unlocked
   *
   * This gets rendered when the user is on the Find Test Page at initial load
   */
  useEffect(() => {
    if (
      localStorage.getItem("chatHistory").length <= 2 &&
      pathname.includes(NavigationPathways.FindTests)
    ) {
      dispatch(
        navigationSliceActions.updatePrecisionMedicinePageChatLockout(true)
      );

      const imageUrl = "/images/molecularTestingTable.png";
      dispatch(
        chatSliceActions.updateResponseList({
          ...ChatbotResponse,
          chatId: uuidv4(),
          chatType: ChatType.chatbot,
          chatBody: 
          `Use the Molecular Testing Table
          </span> (<a href="${imageUrl}" target="_blank" style="color: blue; text-decoration: underline;">Molecular Testing Table</a>) or enter known biomarkers.`,
        dateTimeReceived: new Date().toISOString(),
      })
    );

      dispatch(
        chatSliceActions.updateResponseList({
          ...ChatbotResponse,
          chatId: uuidv4(),
          chatType: ChatType.precisionMedicineFilters,
          chatBody: "Please narrow down your search.",
          dateTimeReceived: new Date().toISOString(),
          chartType: PrecisionMedicineChartTypes.tests,
          submitButtonName: "Find Tests",
        })
      );

      dispatch(
        globalSliceActions.setChatStateSpecific(ChatState.ShowFindTests)
      );
    } else {
      dispatch(precisionMedicineSliceActions.clearSelections());
    }
  }, []);

  return (
    <ChatPage
      chatInputLockout={navigationSlice.precisionMedicinePageChatLockout}
      endingMargin={250}
      ignoreCancerTypeSelection={true}
      backgroundStyle={{ paddingBottom: "var(--spacing-big)" }}
    />
  );
}
