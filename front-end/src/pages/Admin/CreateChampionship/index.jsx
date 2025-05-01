import React, { useState } from "react";
import Header from "../../../components/Header";
import InputItem from "../../../components/InputItem";
import ComboBoxItem from "../../../components/ComboBoxItem";
import FormButton from "../../../components/FormButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./styles.css";
const schema = yup
  .object({
    name: yup.string().required(),
    gamesPerDay: yup.number().required(),
    gamesInterval: yup.number().required(),
    initialDate: yup.date().required(),
    mode: yup.string().required(),
    players: yup.number().required(),
    minPositionClass: yup.string().required(),
    maxPositionClass: yup.string().required(),
    minPositionDesc: yup.string().required(),
    maxPositionDesc: yup.string().required(),
  })
  .required();

const CreateChampionship = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const [selectedValue, setSelectedValue] = useState();
  const [teamsNumber, setTeamsNumber] = useState();

  return (
    <div className="create-championship">
      <Header />
      <form className="create-championship__form">
        <div className="create-championship__input-area">
          <InputItem
            control={control}
            label="Nome do Campeonato"
            name="name"
            placeholder="Nome do Campeonato"
          />
          <InputItem
            control={control}
            label="Jogos realizados por dia"
            name="gamesPerDay"
            placeholder="Jogos por dia"
            type="number"
          />
        </div>
        <div className="create-championship__input-area">
          <InputItem
            control={control}
            label="Intervalo de dias entre os jogos"
            name="gamesInterval"
            placeholder="Intervalo"
            type="number"
          />
          <InputItem
            control={control}
            label="Data de inicio"
            name="initialDate"
            type="date"
          />
        </div>
        <ComboBoxItem
          control={control}
          label="Modo de Jogo"
          placeholder="Escolha o modo de jogo"
          options={["Playoffs", "Pontos Corridos"]}
          name="mode"
          onChange={setSelectedValue}
        />
        <p className="create-championship__subtitle">
          Vamos Configurar o modelo do campeonato:
        </p>
        {selectedValue === "Playoffs" ? (
          <>
            <ComboBoxItem
              control={control}
              label="Quantas equipes irão participar"
              placeholder="Selecione"
              options={[4, 8, 16]}
              name="players"
              onChange={setTeamsNumber}
            />
            {teamsNumber != undefined ? (
              <p className="create-championship__subtitle">
                Tudo Certo! Essa quantidade de times irá gerar um campeonato
                onde os confrontos dos playoffs começarão a partir das{" "}
                {teamsNumber == "4" ? (
                  <b>semifinais</b>
                ) : teamsNumber == "8" ? (
                  <b>quartas-de-final</b>
                ) : teamsNumber == "16" ? (
                  <b>oitavas-de-final</b>
                ) : (
                  <></>
                )}
              </p>
            ) : (
              <></>
            )}
          </>
        ) : selectedValue === "Pontos Corridos" ? (
          <>
            <InputItem
              control={control}
              label="Quantas equipes irão participar"
              name="players"
              placeholder="Numero de equipes"
              type="number"
            />
            <p className="create-championship__subtitle">
              Existem posições de classificação? Se sim, de qual a qual?
            </p>
            <div className="create-championship__input-area">
              <InputItem
                control={control}
                label="Posição mínima"
                name="minPositionClass"
                placeholder="Posição mínima"
              />
              <InputItem
                control={control}
                label="Posição máxima"
                name="maxPositionClass"
                placeholder="Posição máxima"
              />
            </div>
            <p className="create-championship__subtitle">
              Existem posições de descenso? Se sim, de qual a qual?
            </p>
            <div className="create-championship__input-area">
              <InputItem
                control={control}
                label="Posição mínima"
                name="minPositionDesc"
                placeholder="Posição mínima"
              />

              <InputItem
                control={control}
                label="Posição máxima"
                name="maxPositionDesc"
                placeholder="Posição máxima"
              />
            </div>
          </>
        ) : (
          <></>
        )}
        <FormButton label="cadastrar" />
      </form>
    </div>
  );
};

export default CreateChampionship;
