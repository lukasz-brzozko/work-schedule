import React from "react";

const Input = (props) => {
  const { modifier, value, change, min, max } = props;

  return (
    <input
      type="date"
      id="date"
      name="date"
      className={`date${modifier ? " date" + modifier : ""}`}
      value={value}
      onChange={change}
      placeholder="Wybierz datę"
      required
      min={min}
      max={max}
    />
  );
};

export default Input;
