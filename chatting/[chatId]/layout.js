// src/app/chatting/[chatId]/layout.js

// -- Meta Data --
export const metadata = {
  title: "Chat | DORIS",
};
// -- end Meta Data --
  
export default function Layout({ children }) {
  return <>{children}</>; // This wraps the children with any layout you want
}