import React from "react";
import logoSportech from "../../assets/images/sportech-logo.png";
import "./styles.css";
import { useNavigate } from "react-router-dom";
const Header = ({ link = 0 }) => {
  const navigate = useNavigate();
  let goTo = "/";
  if (link == 1) goTo = "/player/menu";
  if (link == 2) goTo = "/admin/menu";
  return (
    <div className="header">
      <img
        src={logoSportech}
        alt="logo"
        className="header__img"
        onClick={() => navigate(goTo)}
      />
    </div>
  );
};

export default Header;
