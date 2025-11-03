import APIConfigHandler from "@/redux/hooks/APIConfigHandler";

// API CALL

/**
 *  This function is used to get the suggested questions for precision medicine.
 * It sends a request to the server to get the suggested questions for precision medicine.
 * The server will then return the suggested questions.
 * The suggested questions are used to determine the suggested questions for precision medicine.
 *
 * It takes in the following props:
 * - apiKey: The user's API key
 *
 * It is a GET request.
 */
export default async function getPrecisionMedicineSuggestedQuestions({
  apiKey,
}) {
  const config = await APIConfigHandler();
  try {
    const response = await fetch(
      `${config.API_ROOT.PRECISION_MEDICINE_API_BASE_URL}/api/pmchatquestions/`,
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
    console.log("Error getting suggested questions");
  }
}
