"use client";

import style from "./navbar.module.css";
import Image from "next/image";

import LogoDarkTransparent from "/public/images/logo-dark-transparent.png";
import LogoDarkTransparentGreyScale from "/public/images/dorisTransparentFullGreyscale.png";
import DORIS_alphalogo from "/public/images/DORIS_ALPHA.png";


import { useDispatch, useSelector } from "react-redux";
import NewChatButton from "./NewChatButton/newChatButton";
import IconWithContentWrapper from "../Wrappers/iconWithContentWrapper/iconWithContentWrapper";
import {
  ClockBackIcon,
  SettingsIcon,
  HospitalIcon,
  DrugsIcon,
  RoadIcon,
  NavIcon,
  PlusIcon,
  VialIcon,
  DnaIcon,
} from "../../../public/icons";
import {
  ChatState,
  GeneralIconSize,
  SelectedPage,
  globalSliceActions,
} from "@/redux/Slices/globalsSlice";
import { chatSliceActions } from "@/redux/Slices/chatSlice";

import { usePathname, useRouter } from "next/navigation";
import IconButton from "../Utils/iconButton/iconButton";
import Spacer from "../Utils/spacer/spacer";

import { useEffect } from "react";
import useScreenWidth from "@/redux/hooks/UseScreenWidth";
import {
  NavigationPathways,
  navigationSliceActions,
} from "@/redux/Slices/navigationSlice";
import { clinicalTrialsSliceActions } from "@/redux/Slices/clinicalTrialsSlice";
import getClearChat from "./services/getClearChat";
import { Tooltip } from "react-tooltip";
import { precisionMedicineSliceActions } from "@/redux/Slices/precisionMedicineSlice";
import NavFooter from "./NavFooter/navFooter";
import { trackNewChatButtonClick, trackDorisLogoClick, trackTogglePreferencesSidebar } from "@/utils/analytics";

/**
 *  This component is used to create a navbar.
 * The navbar is used to navigate the user to different pages.
 * The navbar is suppose to be displayed on the left side of the screen
 *
 * The navbar has the following features:
 * - Home: Navigates the user to the home page
 * - Explore: Navigates the user to the explore page
 * - Clinical Trials: Navigates the user to the clinical trials page
 * - Clinical Pathways: Navigates the user to the clinical pathways page
 * - Drug Comparisons: Navigates the user to the drug comparisons page
 * - Precision Medicine: Navigates the user to the precision medicine page
 * - User Preferences: Navigates the user to the user preferences page
 * - Chat History: Navigates the user to the chat history page
 * - Collapse Menu: Collapses the menu
 *
 * It takes in the following props:
 * - expandExplore: A boolean to determine if the explore page should be expanded
 * - forceNavMenuCollapse: A boolean to determine if the nav menu should be collapsed
 */
export default function Navbar(props) {
  // -- Local State --
  //const [open, setOpen] = useState(false);
  // -- end Local State --

  // -- Redux Global State --
  const globalSlice = useSelector((state) => state.globalSlice);
  const userSlice = useSelector((state) => state.userSlice);
  const navigationSlice = useSelector((state) => state.navigationSlice);
  const dispatch = useDispatch();
  // -- end Redux Global State --

  // -- NextJS Router --
  const router = useRouter();
  const pathname = usePathname();
  // -- end NextJS Router --

  // -- Local State --
  const screenWidth = useScreenWidth();
  // -- end Local State --

  // -- Styles --
  const overallStyle = {
    backgroundColor: userSlice.darkMode
      ? globalSlice.tertiaryColorDark
      : globalSlice.tertiaryColor,

    color: userSlice.darkMode
      ? globalSlice.primaryTextColorDark
      : globalSlice.primaryTextColor,

    fontSize: globalSlice.fontSize,
    minWidth: navigationSlice.collapseNavMenu ? "65px" : null,
    width: navigationSlice.collapseNavMenu ? "65px" : null,
  };

  const collapseButtonStyle = {
    left: navigationSlice.collapseNavMenu ? "75px" : null,
    backgroundColor: userSlice.darkMode
      ? globalSlice.tertiaryColorDark
      : globalSlice.tertiaryColor,
  };

  const iconWrapperStyle = {
    ...GeneralIconSize,
    color: userSlice.darkMode
      ? globalSlice.iconColorDark
      : globalSlice.iconColor,
  };

  const iconStyle = {
    ...iconWrapperStyle,
    backgroundColor: "transparent",
    color: userSlice.darkMode
      ? globalSlice.iconColorDark
      : globalSlice.iconColor,
  };

  const selectedTabStyle = {
    backgroundColor: `rgba(245, 245, 245, 1)`,
  };

  const tooltipStyle = {
    backgroundColor: userSlice.darkMode
      ? globalSlice.tertiaryColorDark
      : globalSlice.tertiaryColor,

    color: userSlice.darkMode
      ? globalSlice.primaryTextColorDark
      : globalSlice.primaryTextColor,

    borderRadius: "var(--border-radius)",
    zIndex: 5,
  };

  // -- end Styles --

  /**
   * This function is used to reset all the redux items and local storage.
   * It is used when the user wants to clear the chat.
   * It is used when the user wants to navigate to a different page.
   *
   * It essentially acts as a way to reset the chat and the user's session so that the user can start asking new questions.
   *
   * It resets the following:
   * - The chat response list
   * - The clinical trials slice
   * - The chat history in local storage
   * - The selected cancer type in local storage
   */
  const resetAllReduxItemsAndStorage = () => {
    dispatch(chatSliceActions.clearCurrentChatResponseList());
    dispatch(clinicalTrialsSliceActions.clearClinicalTrialsSlice());
    dispatch(precisionMedicineSliceActions.clearSelections());

    localStorage.setItem("chatHistory", JSON.stringify([]));
    localStorage.setItem("selectedCancerType", null);
  };

  /**
   * button that shows when user wants to clear the chat - ONLY SHOWS ON [/CHATTING] PAGE
   */
  const clearChat = async () => {
    await getClearChat({ apiKey: userSlice.userAPIKey });

    resetAllReduxItemsAndStorage();

    dispatch(globalSliceActions.setChatStateSpecific(ChatState.ShowNone));
    dispatch(globalSliceActions.updateSelectedPage(SelectedPage.Home));
    dispatch(globalSliceActions.updateGlobalLockout(false));

    dispatch(navigationSliceActions.updatePreviousPath(pathname));
    router.push("/dashboard", undefined, { shallow: true });
  };

  /**
   * nav element that shows the chat history page
   */
  const showHideChatHistory = async () => {
    if (globalSlice.chatState == ChatState.ShowHistory) {
      dispatch(globalSliceActions.setChatStateSpecific(ChatState.ShowNone));
    } else {
      dispatch(globalSliceActions.setChatStateSpecific(ChatState.ShowHistory));
    }
  };

  /**
   * nav element that shows the user preferences page
   */
  const showHideSettings = async () => {
    if (globalSlice.chatState == ChatState.ShowUserPreferences) {
      if (router.pathname.includes("/chatting")) {
        dispatch(
          globalSliceActions.setChatStateSpecific(ChatState.ShowExplore)
        );
      } else {
        dispatch(navigationSliceActions.setCollapseSettingsMenu(false));

        // Track the user pref sidebar state
        trackTogglePreferencesSidebar(false);
      }
    } else {
      dispatch(navigationSliceActions.setCollapseSettingsMenu(true));

      // Track the user pref sidebar state
      trackTogglePreferencesSidebar(true);
    }
  };

  /**
   * nav element that shows the clinical trials page
   */
  const navigateToClinicalTrials = async () => {
    if (!pathname.includes(NavigationPathways.ClinicalTrialFinder)) {
      resetAllReduxItemsAndStorage();
      dispatch(navigationSliceActions.updatePreviousPath(pathname));
      router.push(NavigationPathways.ClinicalTrialFinder, undefined, {
        shallow: true,
      });
    }
  };

  /**
   * nav element that shows the clinical pathways page
   */
  const navigateToClinicalPathways = async () => {
    if (!pathname.includes(NavigationPathways.ClinicalPathways)) {
      resetAllReduxItemsAndStorage();
      dispatch(navigationSliceActions.updatePreviousPath(pathname));
      router.push(NavigationPathways.ClinicalPathways, undefined, {
        shallow: true,
      });
    }
  };

  /**
   * nav element that shows the drug comparisons page
   * */
  const navigateToDrugComparisons = async () => {
    if (!pathname.includes(NavigationPathways.DrugComparison)) {
      resetAllReduxItemsAndStorage();
      dispatch(navigationSliceActions.updatePreviousPath(pathname));
      router.push(NavigationPathways.DrugComparison, undefined, {
        shallow: true,
      });
    }
  };

  /**
   * nav element that shows the identify biomarkers page
   */
  const navigateToIdentifyBiomarkers = async () => {
    if (!pathname.includes(NavigationPathways.IdentifyBiomarkers)) {
      resetAllReduxItemsAndStorage();
      dispatch(navigationSliceActions.updatePreviousPath(pathname));
      router.push(NavigationPathways.IdentifyBiomarkers, undefined, {
        shallow: true,
      });
    }
  };

  /**
   * nav element that shows the find tests page
   */
  const navigateToFindTests = async () => {
    if (!pathname.includes(NavigationPathways.FindTests)) {
      resetAllReduxItemsAndStorage();
      dispatch(navigationSliceActions.updatePreviousPath(pathname));
      router.push(NavigationPathways.FindTests, undefined, {
        shallow: true,
      });
    }
  };

  /**
   * This collapses the nav menu so that is only shows the icons
   * */
  const showCollapseMenu = () => {
    dispatch(navigationSliceActions.setCollapsesNavMenu());
  };

  /**
   * This function is used to determine what type of nav 'expansion' the navbar should be in whenever it first loads
   */
  useEffect(() => {
    dispatch(navigationSliceActions.updateDrugComparisonPageChatLockout(false));
    dispatch(globalSliceActions.updateGlobalLockout(false));

    if (props.forceNavMenuCollapse) {
      dispatch(navigationSliceActions.setCollapsesNavMenu(true));
    }
  }, []);

  /**
   * This function looks at the current screen width and determines if the nav menu should be collapsed or not
   */
  useEffect(() => {
    if (screenWidth < 700 && screenWidth != 0) {
      dispatch(navigationSliceActions.setCollapsesNavMenu(true));
    }
  }, [screenWidth]);

 return (
    <div className={style.overall} style={overallStyle}>
      <div className={style.content}>
        <div className={style.top}>
          <div className={style.logo}>
            {!navigationSlice.collapseNavMenu ? (
              <div>
                <Image
                  className={style.logoImage}
                  src={
                    userSlice.darkMode
                      ? (userSlice.useGreyScale ? LogoDarkTransparentGreyScale : LogoDarkTransparent) 
                      : DORIS_alphalogo 
                  }
                  width={100}
                  height={100}
                  alt="DORIS Logo" // Alt text for clarity
                  onClick={ () => {
                      clearChat();
    
                      // Track DORIS logo click
                      trackDorisLogoClick();
                    }
                  }
                />
              </div>
            ) : null}
  
            {!navigationSlice.collapseNavMenu ? (
              <div className={style.mostRight}>
                <Spacer width={5} />
                <IconButton
                  buttonIcon={
                    <SettingsIcon
                      style={{
                        ...iconStyle,
                        color:
                          globalSlice.chatState == ChatState.ShowUserPreferences
                            ? globalSlice.primaryColor
                            : userSlice.darkMode
                            ? globalSlice.iconColorDark
                            : globalSlice.iconColor,
                      }}
                    />
                  }
                  style={{ backgroundColor: "transparent" }}
                  onClick={showHideSettings}
                />
              </div>
            ) : null}
          </div>
          {!navigationSlice.collapseNavMenu ? (
            <div className={style.newChatWrapper}>
              <NewChatButton onClick={ () => {
                  clearChat();

                  // Track new chat button click
                  trackNewChatButtonClick();
                }
              }/>
            </div>
          ) : null}
          {navigationSlice.collapseNavMenu ? (
            <div
              className={style.navLink}
              onClick={ () => {
                  clearChat();

                  // Track new chat button click
                  trackNewChatButtonClick();
                }
              }
              data-tooltip-id="new-chat"
              data-tooltip-content="New Chat"
            >
              <PlusIcon style={iconWrapperStyle} />
            </div>
          ) : null}
  
          {/* 
          <div
            className={style.navLink}
            onClick={navigateToIdentifyBiomarkers}
            style={
              pathname.includes(NavigationPathways.IdentifyBiomarkers)
                ? selectedTabStyle
                : null
            }
            data-tooltip-id="identify-biomarkers"
            data-tooltip-content="Identify Biomarkers"
          >
            <IconWithContentWrapper
              icon={<DnaIcon style={iconWrapperStyle} />}
              showChildren={!navigationSlice.collapseNavMenu}
            >
              Identify Biomarkers
            </IconWithContentWrapper>
          </div>
          <div
            className={style.navLink}
            onClick={navigateToFindTests}
            style={
              pathname.includes(NavigationPathways.FindTests)
                ? selectedTabStyle
                : null
            }
            data-tooltip-id="find-tests"
            data-tooltip-content="Find Tests"
          >
            <IconWithContentWrapper
              icon={<VialIcon style={iconWrapperStyle} />}
              showChildren={!navigationSlice.collapseNavMenu}
            >
              Find Tests
            </IconWithContentWrapper>
          </div>
          */}
  
          <div
            className={style.navLink}
            onClick={navigateToClinicalTrials}
            style={
              pathname.includes(NavigationPathways.ClinicalTrialFinder)
                ? selectedTabStyle
                : null
            }
            data-tooltip-id="clinical-trial-finder"
            data-tooltip-content="Clinical Trial Finder"
          >
            <IconWithContentWrapper
              icon={<HospitalIcon style={iconWrapperStyle} />}
              showChildren={!navigationSlice.collapseNavMenu}
            >
              Clinical Trial Finder
            </IconWithContentWrapper>
          </div>
          {/* 
          <div
            className={style.navLink}
            onClick={navigateToClinicalPathways}
            style={
              pathname.includes(NavigationPathways.ClinicalPathways)
                ? selectedTabStyle
                : null
            }
            data-tooltip-id="clinical-pathways"
            data-tooltip-content="Clinical Pathways"
          >
            <IconWithContentWrapper
              icon={<RoadIcon style={iconWrapperStyle} />}
              showChildren={!navigationSlice.collapseNavMenu}
            >
              Clinical Pathways
            </IconWithContentWrapper>
          </div>
          */}
          <div
            className={style.navLink}
            onClick={navigateToDrugComparisons}
            style={
              pathname.includes(NavigationPathways.DrugComparison)
                ? selectedTabStyle
                : null
            }
            data-tooltip-id="drug-comparison"
            data-tooltip-content="Drug Comparison"
          >
            <IconWithContentWrapper
              icon={<DrugsIcon style={iconWrapperStyle} />}
              showChildren={!navigationSlice.collapseNavMenu}
            >
              Drug Comparisons
            </IconWithContentWrapper>
          </div>

          {!pathname.includes(NavigationPathways.ClinicalTrialFinder) && (
            <div
              className={style.navLink}
              onClick={showHideChatHistory}
              style={
                globalSlice?.chatState === ChatState.ShowHistory
                  ? selectedTabStyle
                  : null
              }
              data-tooltip-id="history"
              data-tooltip-content="History"
            >
              <IconWithContentWrapper
                icon={<ClockBackIcon style={iconWrapperStyle} />}
                showChildren={!navigationSlice?.collapseNavMenu}
              >
                History
              </IconWithContentWrapper>
            </div>
          )}

          {navigationSlice.collapseNavMenu ? (
            <div
              className={style.navLink}
              onClick={showHideSettings}
              data-tooltip-id="settings"
              data-tooltip-content="Settings"
            >
              <IconWithContentWrapper
                icon={
                  <SettingsIcon
                    style={{
                      ...iconWrapperStyle,
                      color:
                        globalSlice.chatState == ChatState.ShowUserPreferences
                          ? globalSlice.primaryColor
                          : userSlice.darkMode
                          ? globalSlice.iconColorDark
                          : globalSlice.iconColor,
                    }}
                  />
                }
              />
            </div>
          ) : null}
        </div>
        {/* Nav footer area */}
        {!navigationSlice.collapseNavMenu ? <NavFooter /> : null}
      </div>
      {!navigationSlice.collapseSettingsMenu ? (
        <div
          className={style.collapseButton}
          style={collapseButtonStyle}
          onClick={showCollapseMenu}
        >
          <NavIcon
            style={{
              ...iconStyle,
              transform: navigationSlice.collapseNavMenu
                ? "rotate(0deg)"
                : "rotate(180deg)",
              transition: globalSlice.generalAnimation,
            }}
          />
        </div>
      ) : null}
  
      {navigationSlice.collapseNavMenu ? (
        <div>
          <Tooltip id="new-chat" style={tooltipStyle} />
          <Tooltip id="home" style={tooltipStyle} />
          {/* 
          <Tooltip id="identify-biomarkers" style={tooltipStyle} />
          <Tooltip id="find-tests" style={tooltipStyle} />
          <Tooltip id="clinical-trial-finder" style={tooltipStyle} />
          <Tooltip id="clinical-pathways" style={tooltipStyle} />
          */}
          <Tooltip id="drug-comparison" style={tooltipStyle} />
          {/* 
          <Tooltip id="history" style={tooltipStyle} />
          */}
          <Tooltip id="settings" style={tooltipStyle} />
        </div>
      ) : null}
    </div>
  );
}  
