import React, { useEffect, useState } from "react";
import "./styles.css";
import ComboBoxItem from "../../../components/ComboBoxItem";
import FormButton from "../../../components/FormButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "../../../components/Header";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";


//TODO INTEGRAR COM O BACK
const schema = yup
  .object({
    name: yup.number(),
  })
  .required();

const ChooseTeam = () => {
  const [selectedTeam, setSelectedTeam] = useState();
  const {
    player,
    selectedChampionship,
    teamsByCaptain,
    handleGetTeamsByCaptain,
  } = usePlayerAuth();

  useEffect(() => {
    const getTeams = async () => {
      await handleGetTeamsByCaptain(player.id);
    };
    getTeams();
  }, [player.id]);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      teamId: selectedTeam,
      champId: selectedChampionship.id,
    };
    console.log(payload);
  };

  return (
    <div className="choose-team">
      <Header />
      <div className="choose-team__area">
        <p>SELECIONE O TIME QUE IRÁ SE INSCREVER</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ComboBoxItem
            control={control}
            label="Time"
            placeholder="Escolha o time"
            options={teamsByCaptain.map((team) => team.name)}
            values={teamsByCaptain.map((team) => team.id)}
            name="name"
            onChange={setSelectedTeam}
          />
          <FormButton label="Se inscrever" />
        </form>
      </div>
    </div>
  );
};

export default ChooseTeam;
