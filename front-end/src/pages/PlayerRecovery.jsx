import React from "react";
import Main from "../components/Main";
const PlayerRecovery = () => {
  return (
    <>
      <Main
        inputNumber={1}
        inputLabels={[" Usuário"]}
        inputPlaceholders={["Usuário"]}
        buttonNumber={1}
        buttonLabels={["Recuperar Senha"]}
        buttonLinks={["/player/recovery/sms"]}
        buttonColors={["#14ae5c"]}
      />
    </>
  );
};

export default PlayerRecovery;
