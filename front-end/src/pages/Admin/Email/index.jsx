import React from "react";
import Header from "../../../components/Header";
import "./styles.css";
import ButtonItem from "../../../components/ButtonItem";

const AdminSms = () => {
  return (
    <div className="player-sms">
      <Header/>
      <div className="player-sms__text">
        <p>
          Pronto, você receberá um lembrete sobre sua senha por meio de um email,
          que será enviado ao seu email cadastrado.
        </p>
      </div>
      <ButtonItem
        label="Voltar ao Login"
        color="#14ae5c"
        link="/admin/login"
      />
    </div>
  );
};

export default AdminSms;
