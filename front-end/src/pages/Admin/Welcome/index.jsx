import React from "react";
import Header from "../../../components/Header";
import ButtonItem from "../../../components/ButtonItem";
import  './styles.css';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <Header />
      <h2>Bem Vindo ao Quadra!</h2>
      <p className="welcome-container__text">
        Que tal cadastrar uma quadra? Assim você poderá começar a utilizar seu
        novo gerenciador de quadras
      </p>
      <div>

      <ButtonItem link='/admin/create-court' label="Iniciar"/>
      </div>
    </div>
  );
};

export default Welcome;
