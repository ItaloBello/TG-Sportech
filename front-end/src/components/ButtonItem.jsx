import React from "react";
import { Link } from "react-router-dom";

const ButtonItem = ({ label, link }) => {
  return (
    <>
      <Link className="button-item" to={link}>
        <span>{label}</span>
      </Link>
    </>
  );
};

export default ButtonItem;
