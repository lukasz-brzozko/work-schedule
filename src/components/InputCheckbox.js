import React from "react";
import "./sass_components/_InputCheckbox.scss";

const InputcheckBox = ({ checked, change }) => {
  return (
    <>
      <input
        type="checkbox"
        checked={checked}
        onChange={change}
        className="panel-view__checkbox checkbox"
        id="checkbox"
      />
      <label htmlFor="checkbox" className="checkbox__label">
        <div className="checkbox__wrapper">
          <div id="tick_mark" className="checkbox__tick-mark"></div>
          <div id="cross" className="checkbox__cross"></div>
        </div>
        <span className="checkbox__label-text">Wyślij powiadomienie</span>
      </label>
    </>
  );
};

export default InputcheckBox;
