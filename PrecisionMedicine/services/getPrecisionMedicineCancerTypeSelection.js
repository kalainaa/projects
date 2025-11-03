import APIConfigHandler from "@/redux/hooks/APIConfigHandler";

// API CALL

/**
 * This function is used to get the cancer types for precision medicine.
 * It sends a request to the server to get the cancer types for precision medicine.
 * The server will then return the cancer types.
 * The cancer types are used to determine the cancer types for precision medicine.
 *
 * It takes in the following props:
 * - apiKey: The user's API key
 *
 *
 * It is a GET request.
 */
export default async function getPrecisionMedicineCancerTypesSelection({
  apiKey,
}) {
  try {
    const config = await APIConfigHandler();
    const response = await fetch(
      `${config.API_ROOT.PRECISION_MEDICINE_API_BASE_URL}/api/cancer_type_select/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiKey}`,
        },
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error getting cancer types");
  }
}
