// DEV API

import APIConfigHandler from "@/redux/hooks/APIConfigHandler";

// API CALL

/**
 * This function is used to clear the chat history.
 * It sends a request to the server to clear the chat history.
 * The server will then clear the chat history. It is more of a server specific function to let the server know to clear the chat history.
 *
 * It is a POST request.
 *
 * The function takes in the following props:
 * - apiKey: The user's API key
 *
 *
 */
export default async function getClearChat({ apiKey }) {
  const config = await APIConfigHandler();
  await fetch(`${config.API_ROOT.CHAT_API_BASE_URL}/chat/clearcurrenthistory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      clearHistory: true,
    }),
  }).catch((error) => {
    console.error("Error clearing chat history", error);
  });
}
