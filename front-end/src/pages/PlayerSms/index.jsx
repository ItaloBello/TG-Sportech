import React from "react";
import Header from "../../components/Header";

import "./styles.css"
import ButtonItem from "../../components/ButtonItem";
const PlayerSms = () => {
  return (
    <div className="player-sms">
      <Header />
      <div className="player-sms__text">
        <p>
          Pronto, você receberá um lembrete sobre sua senha por meio de um SMS,
          que será enviado ao seu número de celular cadastrado.
        </p>
      </div>
      <ButtonItem label={"Voltar ao Login"} color={"#14ae5c"} link={"/player/login"}/>
    </div>
  );
};

export default PlayerSms;
