import React from "react";
import "./Input.css";

const Input = props => (
  <input
    type="date"
    class="date"
    value={props.value}
    onChange={props.change}
    placeholder="Wybierz datę"
  />
);

export default Input;
