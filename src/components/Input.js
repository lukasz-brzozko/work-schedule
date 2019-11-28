import React from "react";

const Input = props => (
  <input
    type="date"
    className={`date${props.modifier ? " date" + props.modifier : ""}`}
    value={props.value}
    onChange={props.change}
    placeholder="Wybierz datę"
    required
  />
);

export default Input;
