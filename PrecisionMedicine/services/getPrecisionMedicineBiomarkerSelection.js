import APIConfigHandler from "@/redux/hooks/APIConfigHandler";

//API CALL

/**
 * This function is used to get the biomarker selection for precision medicine.
 * It sends a request to the server to get the biomarker selection for precision medicine.
 * The server will then return the biomarker selection.
 * The biomarker selection is used to determine the biomarkers for precision medicine.
 *
 * It takes in the following props:
 * - indication: The indication for precision medicine
 * - cancer_stage: The cancer stage for precision medicine
 * - apiKey: The user's API key
 *
 *
 * It is a POST request.
 */
export default async function getPrecisionMedicineBiomarkerSelection({
  indication,
  cancer_stage,
  apiKey,
}) {
  try {
    const config = await APIConfigHandler();
    const response = await fetch(
      `${config.API_ROOT.PRECISION_MEDICINE_API_BASE_URL}/api/biomarker_selection/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({
          indication: indication,
          cancer_stage: cancer_stage,
        }),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error getting biomarkers");
  }
}
