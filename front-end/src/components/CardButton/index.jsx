import React from "react";
import "./styles.css"

const CardButton = ({ label, colorButton }) => {
 
  return (
    <button className="card-button" style={{ borderColor:colorButton, color:colorButton }}>
        <p>{label}</p>
    </button>
  );
};

export default CardButton;
