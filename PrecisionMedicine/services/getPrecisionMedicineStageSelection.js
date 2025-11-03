import APIConfigHandler from "@/redux/hooks/APIConfigHandler";

// API CALL

/**
 * This function is used to get the stage selection for precision medicine.
 * It sends a request to the server to get the stage selection for precision medicine.
 * The server will then return the stage selection.
 * The stage selection is used to determine the stage for precision medicine.
 *
 * It takes in the following props:
 * - indication: The indication for precision medicine
 * - apiKey: The user's API key
 *
 * It is a POST request.
 */
export default async function getPrecisionMedicineStageSelection({
  indication,
  apiKey,
}) {
  const config = await APIConfigHandler();
  try {
    const response = await fetch(
      `${config.API_ROOT.PRECISION_MEDICINE_API_BASE_URL}/api/stage_selection/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({ indication: indication }),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error getting stages");
  }
}
