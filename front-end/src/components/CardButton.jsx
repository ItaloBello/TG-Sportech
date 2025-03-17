import React, { useState } from "react";
import { Link } from "react-router-dom";

const CardButton = ({ label, colorButton }) => {
 
  return (
    <div className="card-button" style={{ borderColor:colorButton }}>
      <Link style={{ textDecoration: "none", color: colorButton}}>
        <p>{label}</p>
      </Link>
    </div>
  );
};

export default CardButton;
