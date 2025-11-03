//initializes chat interactions and handles the state for identifying biomarkers using various Redux slices, - displays chat page

"use client";

import ChatPage from "@/components/Chat/chatPage/chatPage";
import style from "./identifyBiomarkersPage.module.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  ChatType,
  chatSliceActions,
  ChatbotResponse,
  ChatStreamingAPIVersion,
} from "@/redux/Slices/chatSlice";
import { ChatState, globalSliceActions } from "@/redux/Slices/globalsSlice";
import { v4 as uuidv4 } from "uuid";
import {
  NavigationPathways,
  navigationSliceActions,
} from "@/redux/Slices/navigationSlice";
import {
  PrecisionMedicineChartTypes,
  precisionMedicineSliceActions,
} from "@/redux/Slices/precisionMedicineSlice";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

/**
 * This component is used to display the Identify Biomarkers Page
 * It is used to render all the components that are needed to identify biomarkers in the chatbot
 * The user will be prompted to narrow down their search by selecting certain filters - indicated by the chatType.precisionMedicineFilters and chartType: PrecisionMedicineChartTypes.biomarkers
 * Once the user has selected the filters, the user will be able to identify the biomarkers and the chatbot will be unlocked
 */
export default function IdentifyBiomarkersPage() {
  // -- Redux Global State --
  const navigationSlice = useSelector((state) => state.navigationSlice);
  //  -- end Redux Global State --

  // -- NextJS Router --
  const dispatch = useDispatch();
  const pathname = usePathname();
  // -- end NextJS Router --

  /**
   * This function is used to determine if the user is on the Identify Biomarkers Page
   * this gets rendered when the user is on the Identify Biomarkers Page at initial load
   */
  useEffect(() => {
    if (
      localStorage.getItem("chatHistory").length <= 2 &&
      pathname.includes(NavigationPathways.IdentifyBiomarkers)
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
            </span> (<a href="${imageUrl}" target="_blank" style="color: blue; text-decoration: underline;">Molecular Testing Table</a>) to identify biomarkers to test.`,
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
          chartType: PrecisionMedicineChartTypes.biomarkers,
          submitButtonName: "Find",
        })
      );

      dispatch(
        globalSliceActions.setChatStateSpecific(
          ChatState.ShowIdentifyBiomarkers
        )
      );
    } else {
      dispatch(precisionMedicineSliceActions.clearSelections());
    }
  }, []);

  return (
    <ChatPage
      chatInputLockout={navigationSlice.precisionMedicinePageChatLockout}
      endingMargin={450}
      ignoreCancerTypeSelection={true}
      backgroundStyle={{ paddingBottom: "var(--spacing-big)" }}
    />
  );
}
