import React from "react";
import logoSportech from "../../assets/images/sportech-logo.png";
import "./styles.css";
import { useNavigate } from "react-router-dom";
const Header = ({ link = 0 }) => {
  const navigate = useNavigate();
  let goTo = "/";
  if (window.location.href.split("/")[3] &&
      window.location.href.split("/")[4] != "login" &&
      window.location.href.split("/")[4] != "singup" &&
      window.location.href.split("/")[4] != "recovery" &&
      window.location.href.split("/")[4] != "register-establishment"&&
      window.location.href.split("/")[4] != "welcome"
    )
    if (
      window.location.href.split("/")[3] == "player" 
    )
      goTo = "/player/menu";
    else goTo = "/admin/menu";
  return (
    <div className="header">
      <img
        src={logoSportech}
        alt="logo"
        className="header__img"
        onClick={() => navigate(goTo)}
      />
      {window.location.href.split("/")[3] ? (
        <p className="header__p">
          {window.location.href.split("/")[3].toUpperCase()}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
