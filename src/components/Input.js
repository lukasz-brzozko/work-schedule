import React from "react";

const Input = ({
  modifier,
  value,
  name,
  labelContent,
  change,
  min,
  max,
  id,
}) => {
  return (
    <div className="input__container">
      <label className="input__label" htmlFor={id}>
        {labelContent}
      </label>
      <input
        type="date"
        id={id}
        name={name}
        className={`input date${modifier ? " date" + modifier : ""}`}
        value={value}
        onChange={change}
        required
        min={min}
        max={max}
      />
    </div>
  );
};

export default Input;
