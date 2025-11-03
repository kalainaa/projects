import { useSelector } from "react-redux";
import style from "./statusIndicator.module.css";

import { ToolStatus } from "@/redux/Slices/globalsSlice";
import { useEffect, useState } from "react";

/**
 *  This component is used to create a status indicator.
 * The status indicator is used to display the status of the tool.
 *
 * The status indicator is displayed in the navbar.
 *
 * The status are as follows:
 * - Active: The tool is active
 * - Inactive: The tool is inactive
 * - Updating: The tool is updating
 *
 * It takes in the following props:
 * - useMobileStyle: A boolean to determine if the mobile style should be used
 *
 */

export default function StatusIndicator(props) {
  // -- Redux Global State --
  const globalSlice = useSelector((state) => state.globalSlice);
  const userSlice = useSelector((state) => state.userSlice);
  // -- end Redux Global State --

  // -- Local State --
  const [status, setStatus] = useState({
    backgroundColor: null,
    text: null,
  });
  // -- end Local State --

  // -- Styles --
  const overallStyle = {
    borderColor: userSlice.darkMode
      ? globalSlice.formInputColorDark
      : globalSlice.formInputColor,
  };
  // -- end Styles --

  /**
   * This function is used to update the status of the tool.
   * The status is determined by the globalSlice.toolStatus.
   * The status is updated based on the toolStatus.
   *
   * The status is updated based on the following conditions:
   * - Active: The tool is active
   * - Inactive: The tool is inactive
   * - Updating: The tool is updating
   *
   */
  const updateStatus = () => {
    switch (globalSlice.toolStatus) {
      case ToolStatus.Active:
        setStatus({
          backgroundColor: "green",
          text: "Active",
        });
        break;
      case ToolStatus.Inactive:
        setStatus({
          backgroundColor: "grey",
          text: "Inactive",
        });
        break;
      case ToolStatus.Updating:
        setStatus({
          backgroundColor: "orange",
          text: "Updating",
        });
        break;
      default:
        break;
    }
  };

  /**
   * This useEffect is used to update the status of the tool.
   * It looks at the globalSlice.toolStatus and calls the updateStatus function.
   */
  useEffect(() => {
    updateStatus();
  }, [globalSlice.toolStatus]);

  return (
    <div
      className={props.useMobileStyle ? style.overallAlt : style.overall}
      style={overallStyle}
    >
      <div
        className={style.dot}
        style={{ backgroundColor: status.backgroundColor }}
      />
      <p className={style.statusText}>{status.text}</p>
    </div>
  );
}
