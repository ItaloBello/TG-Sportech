import React from "react";
import "./styles.css";
const FormButton = ({ label }) => {
  return (
    <div className="form-button">
      <button>
        <span>{label}</span>
      </button>
    </div>
  );
};

export default FormButton;
