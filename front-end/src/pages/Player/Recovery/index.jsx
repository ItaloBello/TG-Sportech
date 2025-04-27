import React from "react";
import "./styles.css";
import Header from "../../../components/Header";
import InputItem from "../../../components/InputItem";
import ButtonItem from "../../../components/ButtonItem";
const PlayerRecovery = () => {
  return (
    <>
      <div className="main">
        <Header />
        <InputItem label="Usuário" placeholder="Usuário" />
        <ButtonItem
          color="#14ae5c"
          label="Recuperar Senha"
          link="/player/recovery/sms"
        />
      </div>
    </>
  );
};

export default PlayerRecovery;
