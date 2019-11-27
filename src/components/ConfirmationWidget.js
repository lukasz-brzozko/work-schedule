import React from "react";

const ConfirmationWidget = props => {
  return (
    <div className="confirmation">
      <div className="confirmation__widget">
        <p className="confirmation__text">{props.children}</p>
        <div className="confirmation__button-container">
          <button className="confirmation__button" onClick={props.yesBtn}>
            Tak
          </button>
          <button className="confirmation__button" onClick={props.noBtn}>
            Nie
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationWidget;
