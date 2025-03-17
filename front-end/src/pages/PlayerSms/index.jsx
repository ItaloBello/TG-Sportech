import React from "react";
import Header from "../../components/Header";
import ButtonList from "../../components/ButtonList";
import "./styles.css"
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
      <ButtonList
        items={1}
        type="button-item"
        labels={["Voltar ao Login"]}
        links={["/player/login"]}
        colors={["#14ae5c"]}

      />
    </div>
  );
};

export default PlayerSms;
