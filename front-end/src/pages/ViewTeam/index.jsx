import React from "react";
import InputItem from "../../components/InputItem";
import ButtonItem from "../../components/ButtonItem";
import "./styles.css";
const ViewTeam = () => {
  return (
    // esta tela os inputs terão valores fixos e não serão alterados
    <div className="view-team">
      <div className="view-team__header">
        <p>Time</p>
        <img
          src="../../../public/add-img-team.png"
          alt="adicione a imagem time"
        />
      </div>
      <InputItem label="Nome do Time" placeholder="Time" />
      <InputItem label="Cor Primaria" placeholder="Cor" />
      <InputItem label="Cor Secundaria" placeholder="Cor" />
      <div className="view-team__button-area">
        <ButtonItem label="OK" link="/player/showteam" className="a" />
      </div>
    </div>
  );
};

export default ViewTeam;
