import React from "react";
import "./css/Input.css";

const Input = props => (
  <input
    type="date"
    className="date"
    value={props.value}
    onChange={props.change}
    placeholder="Wybierz datę"
  />
);

export default Input;
