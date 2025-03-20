import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import Header from "../../components/Header";

import InputItem from "../../components/InputItem";
import ButtonItem from "../../components/ButtonItem";
const PlayerLogin = () => {
  return (
    <>
      <div className="main">
        <Header />

        <InputItem label="Nome do Usuário" placeholder="Usuário"/>
        <InputItem label="Senha" placeholder="Senha"/>

        <Link className="link__message" to="/player/recovery">
          <p>Esqueceu a senha, jogador?</p>
        </Link>

        <ButtonItem color="#14ae5c" label="Entrar" link="/player/menu"/>
        
      </div>
      <p className="player-login__p">
        Não possúi cadastro?{"  "}
        <Link to={"/player/singup"} className="link__message">
          Cadastre-se
        </Link>
      </p>
    </>
  );
};

export default PlayerLogin;
