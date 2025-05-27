import React, { useState } from "react";
import Header from "../../../components/Header";
import InputItem from "../../../components/InputItem";
import ComboBoxItem from "../../../components/ComboBoxItem";
import FormButton from "../../../components/FormButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import "./styles.css";

//TODO GERAR INTEGRAÇÂO

const schema = yup
  .object({
    name: yup.string().required(),
    gamesPerDay: yup.number().required(),
    gamesInterval: yup.number().required(),
    initialDate: yup.date().required(),
    teamsNumber: yup.number(),
    description: yup.string(),
    registration: yup.number(),
    premiation: yup.number(),
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

  const [teamsNumber, setTeamsNumber] = useState();

  const onSubmit = (dataForm) => {
    const payload = {
      ...dataForm,
      initialDate: format(dataForm.initialDate, "dd-MM-yyyy"),
      teamsNumber: teamsNumber,
    };
    console.log(payload);
  };

  return (
    <div className="create-championship">
      <Header />
      <form
        className="create-championship__form"
        onSubmit={handleSubmit(onSubmit)}
      >
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
        <div className="create-championship__input-area">
          <InputItem
            control={control}
            label="Descrição"
            name="description"
            placeholder="Descrição"
          />
          <InputItem
            control={control}
            label="Taxa de inscrição (R$)"
            name="registration"
            type="number"
            placeholder="Taxa"
          />
        </div>
        <div className="create-championship__input-area">
          <ComboBoxItem
            control={control}
            label="Quantas equipes irão participar"
            placeholder="Selecione"
            options={[4, 8, 16]}
            name="teamsNumber"
            onChange={setTeamsNumber}
          />
          <InputItem
            control={control}
            label="Premiação (R$)"
            name="premiation"
            type="number"
            placeholder="Premiação"
          />
        </div>
        {teamsNumber != undefined ? (
          <p className="create-championship__subtitle">
            Tudo Certo! Essa quantidade de times irá gerar um campeonato onde os
            confrontos dos playoffs começarão a partir das{" "}
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

        <FormButton label="cadastrar" />
      </form>
    </div>
  );
};

export default CreateChampionship;
