import React from "react";
import InputList from "./InputList";
import Header from "./Header";
import { Link } from "react-router-dom";
import ButtonList from "./ButtonList";

const Main = ({
  inputNumber,
  inputLabels,
  inputPlaceholders,
  buttonNumber,
  buttonLabels,
  buttonLinks,
  buttonColors,
  linkPath,
  linkMessage = "",
}) => {
  return (
    <div className="main">
      <Header />
      <InputList
        items={inputNumber}
        type="input-item"
        labels={inputLabels}
        placeholders={inputPlaceholders}
      />
      {linkMessage != "" ? (
        <Link className="link__message" to={linkPath}>
          <p>{linkMessage}</p>
        </Link>
      ) : (
        <></>
      )}
      <ButtonList
        items={buttonNumber}
        labels={buttonLabels}
        links={buttonLinks}
        colors={buttonColors}
      />
    </div>
  );
};

export default Main;
