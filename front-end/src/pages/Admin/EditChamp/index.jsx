import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../services/api";
import { notifyError } from "../../../utils/notify";
import Header from "../../../components/Header";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import InputItem from "../../../components/InputItem";
import ComboBoxItem from "../../../components/ComboBoxItem";
import FormButton from "../../../components/FormButton";

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

const EditChamp = () => {
  const { championshipId } = useParams();
  const [initialData, setInitialData] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset, // Add reset from useForm
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || { // Ensure defaultValues are set up
      name: '',
      gamesPerDay: '',
      gamesInterval: '',
      initialDate: new Date(),
      teamsNumber: undefined,
      description: '',
      registration: '',
      premiation: '',
    },
    mode: "onBlur",
  });

  const [teamsNumber, setTeamsNumber] = useState();

  useEffect(() => {
    if (championshipId) {
      api.get(`/api/campeonato/${championshipId}`)
        .then(response => {
          const champData = response.data;
          // Adjusting field names to match form expectations if necessary
          const formattedData = {
            ...champData,
            name: champData.nome || '',
            initialDate: champData.data_inicio ? new Date(champData.data_inicio) : new Date(),
            gamesPerDay: champData.jogos_por_dia || '', // Assuming these fields exist or have defaults
            gamesInterval: champData.intervalo_jogos || '', // Assuming these fields exist or have defaults
            teamsNumber: champData.max_times || undefined,
            description: champData.descricao || '',
            registration: champData.registro || '',
            premiation: champData.premiacao || '',
          };
          setInitialData(formattedData);
          reset(formattedData); // reset form with fetched data
          if(formattedData.teamsNumber) setTeamsNumber(formattedData.teamsNumber.toString());
        })
        .catch(error => {
          console.error("Erro ao buscar dados do campeonato:", error);
          notifyError("Não foi possível carregar os dados do campeonato.");
        });
    }
  }, [championshipId, reset]);

  const onSubmit = (dataForm) => {
    // TODO: Implement update logic if championshipId exists
    // For now, it just logs, as per the original component's behavior for creation
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

        <FormButton label="Salvar e Sair" />
      </form>
    </div>
  );
};

export default EditChamp;
