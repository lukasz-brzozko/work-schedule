import React from "react";
import "./css/DayInfo.css";
import Loader from "./Loader";
import GlobalVars from "./GlobalVars";

let { nextDay } = GlobalVars;

const DayInfo = props => {
  if (props.date) {
    const stateDatePlusMiliseconds =
      new Date(props.date).getTime() + parseInt(props.miliseconds);
    const date = new Date(stateDatePlusMiliseconds);
    const weekdays = ["nie.", "pon.", "wto.", "śr.", "czw.", "pt.", "sob."];
    const weekday = weekdays[date.getDay()];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    nextDay = `${weekday}, ${day < 10 ? "0" + day : day}.${
      month < 10 ? "0" + month : month
    }.${year}`;
    if (nextDay.length === 9) {
      nextDay = "0" + nextDay;
    }
  } else {
    nextDay = "Data";
  }

  const labelStyle = !props.date ? { visibility: "hidden" } : {};
  return (
    <div className="flex-wrapper">
      <p className="label" style={labelStyle}>
        {nextDay}
      </p>
      <div className="container next">
        {props.loaderVisibility ? <Loader /> : null}
        <span className="result">{props.answer}</span>
      </div>
    </div>
  );
};

export default DayInfo;
