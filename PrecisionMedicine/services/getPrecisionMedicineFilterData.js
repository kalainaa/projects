import { PrecisionMedicineChartTypes } from "@/redux/Slices/precisionMedicineSlice";
import APIConfigHandler from "@/redux/hooks/APIConfigHandler";

// API CALL

/**
 * This function is used to get the filtered data for precision medicine.
 * It sends a request to the server to get the filtered data for precision medicine.
 * The server will then return the filtered data.
 * The filtered data is used to determine the filtered data for precision medicine.
 *
 * It takes in the following props:
 * - chartType: The chart type for precision medicine
 * - apiKey: The user's API key
 * - precisionMedicineSlice: The precision medicine slice
 *
 * It is a POST request.
 */
export default async function getPrecisionMedicineFilteredData({
  chartType,
  apiKey,
  precisionMedicineSlice,
}) {
  try {
    const config = await APIConfigHandler();
    const response = await fetch(
      chartType == PrecisionMedicineChartTypes.biomarkers
        ? `${config.API_ROOT.PRECISION_MEDICINE_API_BASE_URL}/api/find_result/`
        : `${config.API_ROOT.PRECISION_MEDICINE_API_BASE_URL}/api/find_test/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({
          indication: precisionMedicineSlice.selectedCancerType,
          stage: precisionMedicineSlice.selectedStage,
          biomarker: precisionMedicineSlice.selectedBiomarkers,
          drug: precisionMedicineSlice.selectedDrugs,
        }),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error getting filtered data");
  }
}
