import React from "react";
import Loader from "./Loader";

const DayInfo = props => {
  return (
    <div className="flex-wrapper">
      <p className="label">
        {props.date !== "Invalid date" ? props.date : "Niepoprawna data"}
      </p>
      <div className="container next">
        {props.loaderVisibility && <Loader />}
        <span
          className={`result${props.children &&
            props.setTxtColor(props.children)}`}
        >
          {props.children}
        </span>
      </div>
    </div>
  );
};

export default DayInfo;
