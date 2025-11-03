import style from "./precisionMedicineGeneralChart.module.css";
import { useSelector, useDispatch } from "react-redux";
import FontSizeAsNumberFromString from "@/redux/hooks/FontSizeAsNumberFromString";
import { PrecisionMedicineChartTypes } from "@/redux/Slices/precisionMedicineSlice";
import ErrorText from "@/components/Utils/errorText/errorText";
import ChatWrapper from "@/components/Wrappers/chatWrapper/chatWrapper";
import getClearChat from "@/components/Navbar/services/getClearChat";
import { chatSliceActions } from "@/redux/Slices/chatSlice";
import { globalSliceActions } from "@/redux/Slices/globalsSlice";
import { ChatState, SelectedPage } from "@/redux/Slices/globalsSlice";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { ChatbotResponse } from "@/redux/Slices/chatSlice";
import { ChatType } from "@/redux/Slices/chatSlice";

/**
 * This component is used to display the general chart for precision medicine
 * It is used to render the general chart for precision medicine
 *
 * It takes in the following props:
 * - title: The title of the chart
 * - chartData: The data for the chart
 * - chartType: The type of chart - This is used to determine the properties and data for the chart and whether the chart is for biomarkers or tests (for now)
 */
export default function PrecisionMedicineGeneralChart(props) {
  // -- Redux Global State --
  const globalSlice = useSelector((state) => state.globalSlice);
  const userSlice = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const router = useRouter(); 

  // -- Local State --
  let properties = [];
  let data = [];
  // -- end Local State --

  // -- Styles --
  const userResponseStyle = {
    padding: globalSlice.primaryPadding,
    color: userSlice.darkMode
      ? globalSlice.primaryTextColorDark
      : globalSlice.primaryTextColor,
    transition: globalSlice.generalAnimation,
    fontSize: `${FontSizeAsNumberFromString(globalSlice.fontSize) + 0.1}rem`,
    transition: globalSlice.generalAnimation,
  };

  const textStyle = {
    color: userSlice.darkMode
      ? globalSlice.primaryTextColorDark
      : globalSlice.primaryTextColor,
    fontSize: globalSlice.fontSize,
    transition: globalSlice.generalAnimation,
  };
  

  const cellStyle = {
    ...textStyle,
  };

  const precisionMedicineButtonStyle = {
    backgroundColor: userSlice.darkMode
      ? globalSlice.backgroundColorDark
      : globalSlice.backgroundColor,
    border: `1px solid ${
      userSlice.darkMode
        ? globalSlice.formInputColorDark
        : globalSlice.formInputColor
    }`,
    borderRadius: "20px",
    padding: "10px 20px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
    ...textStyle,
  };

  const cellContentTitle = {
    backgroundColor: userSlice.darkMode
      ? globalSlice.backgroundColorDark
      : globalSlice.backgroundColor,
    textAlign: 'center', 
  };

  const centerCellContent = {
    textAlign: 'center',
    paddingTop: '10px', // Space above text
    paddingRight: '64px', // Space right of text
    paddingLeft: '20px', // Space left of text
  };
  

  // -- end Styles --

  const handleRefresh1 = async () => {
    await getClearChat({ apiKey: userSlice.userAPIKey });
    localStorage.setItem("chatHistory", JSON.stringify([]));
    localStorage.setItem("selectedCancerType", JSON.stringify(null));

    dispatch(chatSliceActions.clearCurrentChatResponseList());
    dispatch(globalSliceActions.setChatStateSpecific(ChatState.ShowNone));
    dispatch(globalSliceActions.updateSelectedPage(SelectedPage.Home));
    dispatch(globalSliceActions.updateGlobalLockout(false));

    if (router) {
      navigateToPrecisionMedicine();
    }
  };

  const navigateToPrecisionMedicine = async () => {
    dispatch(
      chatSliceActions.updateResponseList({
        ...ChatbotResponse,
        chatId: uuidv4(),
        chatType: ChatType.chatbot,
        chatBody: 
          `Great, I can help with tests. To get started, select cancer type and, if known, any test results or therapies used. For reference, use the Molecular Testing Table
          </span> (<a href="${imageUrl}" target="_blank" style="color: blue; text-decoration: underline;">Molecular Testing Table</a>).`,
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
  };

  const handleRefresh2 = async () => {
    await getClearChat({ apiKey: userSlice.userAPIKey });
    localStorage.setItem("chatHistory", JSON.stringify([]));
    localStorage.setItem("selectedCancerType", JSON.stringify(null));

    dispatch(chatSliceActions.clearCurrentChatResponseList());
    dispatch(globalSliceActions.setChatStateSpecific(ChatState.ShowNone));
    dispatch(globalSliceActions.updateSelectedPage(SelectedPage.Home));
    dispatch(globalSliceActions.updateGlobalLockout(false));

    if (router) {
      navigateToPrecisionMedicine2();
    }
  };


  const imageUrl = "/images/molecularTestingTable.png";

  const navigateToPrecisionMedicine2 = async () => {
    dispatch(
      chatSliceActions.updateResponseList({
        ...ChatbotResponse,
        chatId: uuidv4(),
        chatType: ChatType.chatbot,
        chatBody: 
          `Great, I can help with biomarkers. To get started, select cancer type and, if known, any test results or therapies used. For reference, use the Molecular Testing Table
          </span> (<a href="${imageUrl}" target="_blank" style="color: blue; text-decoration: underline;">Molecular Testing Table</a>).`,
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
      globalSliceActions.setChatStateSpecific(ChatState.ShowBiomarkers)
    );
  };

  /**
   * This switch statement is used to determine the properties and data for the chart
   * It is determined by the chartType
   * The properties and data are used to render the chart
   *
   * The properties and data are determined based on the following conditions:
   * - Biomarkers: The properties and data are determined by the biomarkers
   * - Tests: The properties and data are determined by the tests
   *
   * If the chartData is available, the properties and data are determined
   */
  
  if (props.chartData) {
    switch (props.chartType) {
      case PrecisionMedicineChartTypes.biomarkers:
        if (props.chartData[0]) {
          properties = Object.keys(props.chartData[0]);
          data = props.chartData;
        }
        break;

      case PrecisionMedicineChartTypes.tests:
        if (props.chartData["result"]["tests"][0]) {
          properties = Object.keys(props.chartData["result"]["tests"][0]);
          data = props.chartData["result"]["tests"];
        }
        break;

      default:
        break;
    }
  }

  // Identify the index of the "Companion Diagnostic" column
  const companionDiagnosticIndex = properties.findIndex(property =>
    property.toLowerCase() === 'companion_diagnostic'
  );

  return (
    <>
      <ChatWrapper>
        <div className={style.overall} style={userResponseStyle}>
          {props.chartData && data.length === 0 && (
            <ErrorText
              text="No precision medicine data was found. Please enter a different set of information into the filters above to view chart information."
              style={{ width: "100%", maxWidth: "100%" }}
              
            />
          )}
        </div>
      </ChatWrapper>
      {data.length > 0 && (
        <div className={style.chartContent}>
          <table className={style.table}>
            <thead>
              <tr>
                {properties.map((property, index) => {
                  const formattedStr = property.replace(/_/g, ` `);
                  const convertedStr =
                    formattedStr.charAt(0).toUpperCase() +
                    formattedStr.slice(1);
                  return (
                    <td
                      key={index}
                      className={style.cellContentTitle}
                      style={{
                        ...cellStyle,
                        ...cellContentTitle,
                        textAlign: companionDiagnosticIndex === index ? 'center' : 'left', // Center-align Companion Diagnostic column
                      }}
                    >
                      <p>{convertedStr}</p>
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((property, index) => {
                return (
                  <tr key={index}>
                    {properties.map((items, dataIndex) => {
                      return (
                        <td
                          key={dataIndex}
                          className={style.cell}
                          style={{
                            ...textStyle,
                            ...(
                              companionDiagnosticIndex === dataIndex ? centerCellContent : {}
                            ), // Apply only for Companion Diagnostic column
                            
                          }}
                        >
                          <p className={style.cellContentText}>
                            {data[index][items] ?? "Not Provided"}
                          </p>
                        </td>
                        
                      );
                    })}
                  </tr>
                  
                  
                );
                
              })}
              <br></br>
              <br></br>

                <div >              
                {data.length > 1
                ? `${data.length} items found`
                 : `${data.length} item found`}
                 
              </div>
              
            </tbody>
            
          </table>
          <br></br>

          <div className={style.whatsNextPrecisionButtons} style={{ marginTop: '10px', textAlign: 'center' }}>
            <button style={precisionMedicineButtonStyle} onClick={handleRefresh1}>
              Find Another Test
            </button>
            <button style={precisionMedicineButtonStyle} onClick={handleRefresh2}>
              New Biomarker Search
            </button>
           
          </div>
              <br></br>
        </div>
      )}
    </>
  );
}

