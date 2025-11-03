"use client";

import style from "./precisionMedicinePage.module.css";
import { useSelector } from "react-redux";
import PageHeader from "@/components/Utils/pageHeader/pageHeader";
import Spacer from "@/components/Utils/spacer/spacer";
// import TileGroup from "../../TileGroup/tileGroup";
import { precisionMedicineTiles } from "@/components/TileGroup/tileGroupings";
import TileGroup from "@/components/TileGroup/tileGroup";

/**
 * This component is used to display the Precision Medicine Page
 * It is used to render all the components that are needed to display the Precision Medicine Page
 * */
export default function PrecisionMedicinePage() {
  // -- Redux Global State --
  const globalSlice = useSelector((state) => state.globalSlice);
  const userSlice = useSelector((state) => state.userSlice);
  // -- end Redux Global State --

  // -- Styles --
  const overallStyle = {
    backgroundColor: userSlice.darkMode
      ? globalSlice.backgroundColorDark
      : globalSlice.backgroundColor,
  };
  // -- end Styles --

  return (
    <div className={style.overall} style={overallStyle}>
      <div className={style.contentWrapper}>
        <Spacer height={100} />
        <PageHeader
          title={`${globalSlice.productName} Precision Medicine`}
          subTitle={
            "Simplify the process of selecting a precision medicine avenue."
          }
          subTitleStyle={{ fontWeight: "normal" }}
        />
        <TileGroup
          title={"Narrow Your Search"}
          tiles={precisionMedicineTiles}
        />
      </div>
    </div>
  );
}
