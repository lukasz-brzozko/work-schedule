import React from "react";

const ConfirmationWidget = props => {
  return (
    <>
      <div className="confirmation" onClick={props.noBtn}></div>
      <div className="confirmation__widget">
        <p className="confirmation__text">{props.children}</p>
        <div className="confirmation__button-container">
          <button
            className="confirmation__button confirmation__button--yes"
            onClick={props.yesBtn}
          >
            Tak
          </button>
          <button
            className="confirmation__button confirmation__button--no"
            onClick={props.noBtn}
          >
            Nie
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationWidget;
