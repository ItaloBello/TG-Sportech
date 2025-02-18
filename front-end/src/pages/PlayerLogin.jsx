import React from "react";
import Main from "../components/Main";
import { Link } from "react-router-dom";

const PlayerLogin = () => {
  return (
    <>
      <Main
        inputNumber={2}
        inputLabels={["Nome do Usuário", "Senha"]}
        inputPlaceholders={["Usuário", "Senha"]}
        buttonNumber={1}
        buttonLabels={["Entrar"]}
        buttonLinks={["/player/login"]}
        linkPath="/player/recovery"
        linkMessage="Esqueceu a senha, Jogador?"
      />
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
