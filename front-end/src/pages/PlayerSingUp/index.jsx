import React from "react";
import "./styles.css";
import Header from "../../components/Header";

import InputItem from "../../components/InputItem";
import ButtonItem from "../../components/ButtonItem";

export const PlayerSingUp = () => {
  return (
    <>
      <div className="main">
        <Header />
        <InputItem label="Nome do Usuário" placeholder="Usuário"/>
        <InputItem label="Email" placeholder="Email"/>
        <InputItem label="Celular" placeholder="Celular"/>
        <InputItem label="Senha" placeholder="Senha"/>
        <InputItem label="Confirme a Senha" placeholder="Confirme a Senha"/>
        <ButtonItem color="#14ae5c" label="Cadastrar" link="/player/login"/>
      </div>
    </>
  );
};
