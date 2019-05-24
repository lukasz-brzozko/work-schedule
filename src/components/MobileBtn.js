import React from "react";
import "./css/MobileBtn.css";
import { arrowType } from "./GlobalVars";

const MobileBtn = props => (
  <button className="next-day-container button" onClick={props.click}>
    <p className="show-more mobile">Kolejne 3 dni</p>
    <div className="arrows right">
      <i className={arrowType} />
      <i className={arrowType} />
      <i className={arrowType} />
    </div>
    <div className="arrows left">
      <i className={arrowType} />
      <i className={arrowType} />
      <i className={arrowType} />
    </div>
  </button>
);
export default MobileBtn;
