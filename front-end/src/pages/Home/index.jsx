import React from "react";
import ButtonItem from "../../components/ButtonItem";
import Header from "../../components/Header";
import "./styles.css";
const Home = () => {
 
  return (
    <div className="main-page">
      <Header />
      <ButtonItem label="Entrar como Jogador" link="/player/login" />
      <ButtonItem label="Entrar como Dono de Quadra" link="/admin/login" />
    </div>
  );
};

export default Home;
