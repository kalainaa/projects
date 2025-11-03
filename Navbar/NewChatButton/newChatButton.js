import { useSelector } from "react-redux";
import { PlusIcon } from "../../../../public/icons";
import style from "./newChatButton.module.css";

/**
 * This component is used to create a new chat button.
 * This button is used to 'refresh' the chat and lives within the navbar.
 */

export default function NewChatButton(props) {
  // -- Redux Global State --
  const globalSlice = useSelector((state) => state.globalSlice);
  const userSlice = useSelector((state) => state.userSlice);
  // -- end Redux Global State --

  // -- Styles --/
  const overallStyle = {
    backgroundColor: userSlice.darkMode
      ? globalSlice.primaryColorDark
      : globalSlice.primaryColor,

    color: userSlice.darkMode
      ? globalSlice.primaryTextColorDark
      : globalSlice.primaryTextColor,
  };

  const iconColor = {
    //color: globalSlice.primaryTextColorDark,
    color: '#fff', // temp: override theme to hardset color
  };

  const textStyle = {
    //color: globalSlice.primaryTextColorDark,
    color: '#fff', // temp: override theme to hardset color
  };
  // -- end Styles --

  return (
    <div
      className={style.overall}
      style={{ ...overallStyle, backgroundColor: 'rgb(87, 32, 125)' }}
      onClick={props.onClick}
    >
      <p style={textStyle}>New Chat</p>
      <PlusIcon style={iconColor} />
    </div>
  );
}  
