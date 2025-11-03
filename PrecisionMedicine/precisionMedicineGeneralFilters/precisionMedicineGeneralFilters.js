import ChatWrapper from "@/components/Wrappers/chatWrapper/chatWrapper";
import style from "./precisionMedicineGeneralFilters.module.css";
import { useSelector } from "react-redux";
import FontSizeAsNumberFromString from "@/redux/hooks/FontSizeAsNumberFromString";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import GeneralButton from "@/components/Utils/generalButton/generalButton";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  PrecisionMedicineChartTypes,
  precisionMedicineSliceActions,
} from "@/redux/Slices/precisionMedicineSlice";
import { chatSliceActions } from "@/redux/Slices/chatSlice";
import { v4 as uuidv4 } from "uuid";
import { ChatType, ChatbotResponse } from "@/redux/Slices/chatSlice";
import { navigationSliceActions } from "@/redux/Slices/navigationSlice";
import LoadingIndicator from "@/components/Utils/loadingIndicator/loadingIndicator";
import MuiThemeWrapper from "@/components/Wrappers/muiThemeWrapper/muiThemeWrapper";
import { Chip } from "@mui/material";
import getPrecisionMedicineFilterData from "../services/getPrecisionMedicineFilterData";
import getPrecisionMedicineCancerTypeSelection from "../services/getPrecisionMedicineCancerTypeSelection";
import getPrecisionMedicineBiomarkerSelection from "../services/getPrecisionMedicineBiomarkerSelection";
import getPrecisionMedicineDrugSelection from "../services/getPrecisionMedicineDrugSelection";
import getPrecisionMedicineStageSelection from "../services/getPrecisionMedicineStageSelection";

import { getBreastCancerIndex } from "../shared/logic/getBreastCancerIndex";

/**
 * This component is used to display the general filters for precision medicine
 * It is used to render the general filters for precision medicine
 *
 * It takes in the following props:
 * - chartType: The type of chart - This is used to determine the properties and data for the chart and whether the chart is for biomarkers or tests (for now)
 * - submitButtonName: The name of the submit button
 * - chartData: The data for the chart
 */
export default function PrecisionMedicineGeneralFilters(props) {
  // -- Redux Global State --
  const globalSlice = useSelector((state) => state.globalSlice);
  const userSlice = useSelector((state) => state.userSlice);
  const precisionMedicineSlice = useSelector(
    (state) => state.precisionMedicineSlice
  );
  const chatSlice = useSelector((state) => state.chatSlice);
  const dispatch = useDispatch();
  // -- end Redux Global State --

  // -- Local State --
  const [cancerTypes, setCancerTypes] = useState([]);
  const [stages, setStages] = useState([]);
  const [biomarkers, setBiomarkers] = useState([]);
  const [drugs, setDrugs] = useState([]);

  //used to determine if the chart has been rendered - if it has, then the submit button will not be rendered
  const [hasChart, setHasChart] = useState(false);
  const [loading, setLoading] = useState(false);
  //  -- end Local State --

  // -- Styles --
  const overallStyle = {
    // backgroundColor: userSlice.darkMode
    //   ? globalSlice.secondaryColorDark
    //   : globalSlice.secondaryColor,
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
  };

  const formInputStyle = {
    marginBottom: "10px",
    borderRadius: "5px",
    width: "100%",
    zIndex: "100",
    color: userSlice.darkMode
      ? globalSlice.primaryTextColorDark
      : globalSlice.primaryTextColor,
  };
  // -- end Styles --

  /**
   * This function is used to submit the form and get the filtered data
   * Once the data is received, the chart is rendered based on the properties and data and chartType
   */
  const onSubmit = async () => {
    setLoading(true);
    setHasChart(true);

    dispatch(
      navigationSliceActions.updatePrecisionMedicinePageChatLockout(true)
    );
    dispatch(
      chatSliceActions.clearChatTypeInstances(ChatType.precisionMedicineChart)
    );
    dispatch(
      chatSliceActions.clearChatTypeInstances(ChatType.startingQuestions)
    );

    // const results = await getFilteredData();
    const results = await getPrecisionMedicineFilterData({
      chartType: props.chartType,
      apiKey: userSlice.userAPIKey,
      precisionMedicineSlice: precisionMedicineSlice,
    });

    dispatch(
      chatSliceActions.updateResponseList({
        ...ChatbotResponse,
        chatId: uuidv4(),
        chatType: ChatType.precisionMedicineChart,
        chatBody: "Here is the chart you requested.",
        chatTitle: "Precision Medicine Chart",
        chartType: props.chartType,
        chartData: results,
        dateTimeReceived: new Date().toISOString(),
      })
    );

    dispatch(
      navigationSliceActions.updatePrecisionMedicinePageChatLockout(false)
    );
    setLoading(false);
  };

  /**
   * This function is used to get the filtered data
   *
   */
  useEffect(() => {
    const pmAPICall = async () => {
      const results = await getPrecisionMedicineCancerTypeSelection({
        apiKey: userSlice.userAPIKey,
      });

      setCancerTypes(results);
      return results;
    };

    pmAPICall().then((value) => {
      const index = getBreastCancerIndex(value);
      if (index != -1) {
        dispatch(precisionMedicineSliceActions.updateCancerType(value[index]));
      }
    });

    const v = chatSlice.responseList.some((response) => {
      return response.chatType == ChatType.precisionMedicineChart;
    });

    setHasChart(v);
  }, []);

  /**
   * This function is used to get the filtered data based on the selected cancer type, stage, biomarkers, and drugs
   * It updates the dropdown items based on if they change
   */
  useEffect(() => {
    const pmAPICall = async () => {
      switch (props.chartType) {
        case PrecisionMedicineChartTypes.biomarkers:
          let biomarkersResult = [];
          let drugsResult = [];

          try {
            if (precisionMedicineSlice.selectedCancerType) {
              biomarkersResult = await getPrecisionMedicineBiomarkerSelection({
                indication: precisionMedicineSlice.selectedCancerType,
                cancer_stage: precisionMedicineSlice.selectedStage,
                apiKey: userSlice.userAPIKey,
              });
            }
          } catch (error) {
            console.error("Error getting PrecisionMedicineBiomarkerSelection data");
          }

          try {
            if (
              precisionMedicineSlice.selectedCancerType
            ) {
              drugsResult = await getPrecisionMedicineDrugSelection({
                indication: precisionMedicineSlice.selectedCancerType,
                cancer_stage: precisionMedicineSlice.selectedStage,
                apiKey: userSlice.userAPIKey,
              });
            }
          } catch (error) {
            console.error("Error getting PrecisionMedicineDrugSelection data");
          }

          setBiomarkers(biomarkersResult);
          setDrugs(drugsResult);
          break;
        case PrecisionMedicineChartTypes.tests:
          let biomarkersResult1 = [];
          try {
            if (precisionMedicineSlice.selectedCancerType) {
              biomarkersResult1 = await getPrecisionMedicineBiomarkerSelection({
                indication: precisionMedicineSlice.selectedCancerType,
                cancer_stage: precisionMedicineSlice.selectedStage,
                apiKey: userSlice.userAPIKey,
              });
            }
          } catch (error) {}

          setBiomarkers(biomarkersResult1);
          break;

        default:
          break;
      }
    };
    pmAPICall();
  }, [
    precisionMedicineSlice.selectedCancerType,
    precisionMedicineSlice.selectedStage,
    precisionMedicineSlice.selectedBiomarkers,
    precisionMedicineSlice.selectedDrugs,
  ]);

  return (
    <ChatWrapper>
      <MuiThemeWrapper>
        <div
          className={style.overall}
          style={{ ...textStyle, ...overallStyle }}
        >
          <div className={style.topFilters}>
            <Autocomplete
              disablePortal
              options={cancerTypes}
              style={formInputStyle}
              value={precisionMedicineSlice?.selectedCancerType}
              onChange={async (event, value) => {
                dispatch(precisionMedicineSliceActions.updateCancerType(value));
                if (value != null) {
                  const stageResults = await getPrecisionMedicineStageSelection(
                    {
                      indication: value,
                      apiKey: userSlice.userAPIKey,
                    }
                  );

                  setStages(stageResults);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label={`Cancer Type`} />
              )}
              renderTags={(tagValue, getTagProps) => {
                return tagValue.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                  />
                ));
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option}>
                    {option}
                  </li>
                );
              }}
            />
          </div>
          <div className={style.middleFilters}>
            {props.chartType == PrecisionMedicineChartTypes.biomarkers ? (
              <div>
                {/* <Autocomplete
                  multiple
                  disablePortal
                  options={biomarkers?.length > 0 ? biomarkers : []}
                  style={formInputStyle}
                  onChange={(event, value) => {
                    dispatch(
                      precisionMedicineSliceActions.updateBiomarkers(value)
                    );
                  }}
                  isOptionEqualToValue={(option, value) => {
                    return option === value;
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={`Known Test Results*: `} />
                  )}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option}
                      />
                    ));
                  }}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    );
                  }}
                /> */}

                <Autocomplete
                  multiple
                  disablePortal
                  options={drugs?.length > 0 ? drugs : []}
                  style={formInputStyle}
                  onChange={(event, value) => {
                    dispatch(precisionMedicineSliceActions.updateDrugs(value));
                  }}
                  isOptionEqualToValue={(option, value) => {
                    return option === value;
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={`Therapies Used:`} />
                  )}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option}
                      />
                    ));
                  }}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    );
                  }}
                />
              </div>
            ) : (
              <div>
                <Autocomplete
                  multiple
                  disablePortal
                  options={biomarkers?.length > 0 ? biomarkers : []}
                  style={formInputStyle}
                  onChange={(event, value) => {
                    dispatch(
                      precisionMedicineSliceActions.updateBiomarkers(value)
                    );
                  }}
                  isOptionEqualToValue={(option, value) => {
                    return option === value;
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={`Biomarkers `} />
                  )}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option}
                      />
                    ));
                  }}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    );
                  }}
                />
              </div>
            )}
          </div>
          {loading ? (
            <LoadingIndicator />
          ) : (
            <div className={style.submitButton}>
              {precisionMedicineSlice.selectedCancerType && !hasChart ? (
                <GeneralButton
                  buttonText={props.submitButtonName}
                  onClickHandler={onSubmit}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                />
              ) : null}
            </div>
          )}
        </div>
      </MuiThemeWrapper>
    </ChatWrapper>
  );
}
