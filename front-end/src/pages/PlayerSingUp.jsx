import React from "react";
import Main from "../components/Main";

export const PlayerSingUp = () => {
  return (
    <>
      <Main
        inputNumber={5}
        inputLabels={[
          "Nome do Usuário",
          "Email",
          "Celular",
          "Senha",
          "Confirme a Senha",
        ]}
        inputPlaceholders={[
          "Usuário",
          "Email",
          "Celular",
          "Senha",
          "Confirme a Senha",
        ]}
        buttonNumber={1}
        buttonLabels={["Cadastrar"]}
        buttonLinks={["/player/login"]}
        buttonColors={["#14ae5c"]}
      />
    </>
  );
};
