import React from "react";

const InputItem = ({ placeholder, label }) => {
  return (
    <div className="input-item">
      <input
        type="text"
        className="input-item__input"
        placeholder={placeholder}
      />
      <p>{label}</p>
    </div>
  );
};

export default InputItem;
