import React from "react";
import "./css/Loader.css";
const Loader = props => {
  return (
    <div className="loader-container">
      <div className="piece p1" />
      <div className="piece p2" />
      <div className="piece p3" />
    </div>
  );
};

export default Loader;
