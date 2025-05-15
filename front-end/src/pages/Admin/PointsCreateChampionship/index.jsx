import React, { useState } from "react";
import Header from "../../../components/Header";
import InputItem from "../../../components/InputItem";
import { format } from "date-fns";
import FormButton from "../../../components/FormButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    name: yup.string().required(),
    gamesPerDay: yup.number().required(),
    gamesInterval: yup.number().required(),
    initialDate: yup.date().required(),
    players: yup.number(),
    minPositionClass: yup.number(),
    maxPositionClass: yup.number(),
    minPositionDesc: yup.number(),
    maxPositionDesc: yup.number(),
  })
  .required();
//TODO Adicionar descrição, Taxa de inscrição e premiação no cadastro de campeonato

const PointsCreateChampionship = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (dataForm) => {
    const payload = {
      ...dataForm,
      initialDate: format(dataForm.initialDate, "dd-MM-yyyy"),
    };
    console.log("oi");
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

        <FormButton label="cadastrar" />
      </form>
    </div>
  );
};

export default PointsCreateChampionship;
