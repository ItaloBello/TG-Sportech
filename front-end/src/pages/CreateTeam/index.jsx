import React from "react";
import InputList from "../../components/InputList";
import InputItem from "../../components/InputItem";
import ButtonItem from "../../components/ButtonItem";
import "./styles.css"

const CreateTeam = () => {
  return (
    <div className="create-team">
      <div className="create-team__header">
        <p className="create-team__title">Criar Time</p>
        <img
          className="create-team__image"
          src="../../public/add-img-team.png"
          alt="adicionar imagem do time"
        />
        <p className="create-team__image-label">Logo do Time</p>
      </div>
      <InputList
        items={3}
        labels={["Nome do Time", "Cor Primaria", "Cor Secundaria"]}
        placeholders={["Time", "Cor", "Cor"]}
      />
      <div className="create-team__input-and-button">
        <InputItem placeholder={"Code"} label={"Invite Code"} />
        <ButtonItem
          label={"Copiar"}
          link={"/player/createteam"}
          color={"#ffffff"}
        />
      </div>
      <div className="create-team__button-area">
        <ButtonItem
          label={"Cancelar"}
          link={"/player/teammenu"}
          color={"#EC221F"}
        />
        <ButtonItem
          label={"Salvar"}
          link={"/player/teammenu"}
          color={"#14AE5C"}
        />
      </div>
    </div>
  );
};

export default CreateTeam;
