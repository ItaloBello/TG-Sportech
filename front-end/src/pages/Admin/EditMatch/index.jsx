import React, { useState } from "react";
import './styles.css'
import Header from "../../../components/Header";
import ComboBoxItem from "../../../components/ComboBoxItem";
import FormButton from "../../../components/FormButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputItem from "../../../components/InputItem";


const schema = yup
  .object({
    team1Points: yup.number(),
    team2Points: yup.number(),
    matchStatus: yup.string(),
  })
  .required();

const EditMatch = () => {
  const [selectedStatus, setSelectedStatus] = useState();
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
      matchStatus: selectedStatus,
    };
    console.log(payload);
  };
  return (
    <div className="edit-match">
      <Header />

      <div className="edit-match__main">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="edit-match__team-area">
            <InputItem
              control={control}
              label={`pontos time 1`}
              type="number"
              name="team1Points"
              placeholder={'pontos'}
            />
            <InputItem
              control={control}
              label={`pontos time 2`}
              type="number"
              name="team2Points"
              placeholder={'pontos'}
            />
          </div>
          <ComboBoxItem
            control={control}
            label="Indique o status do jogo"
            onChange={setSelectedStatus}
            name="matchStatus"
            options={[
              "Jogo não iniciado",
              "Jogo em andamento",
              "Jogo Finalizado",
            ]}
          />
          <FormButton label="Salvar e sair" />
        </form>
      </div>
    </div>
  );
};

export default EditMatch;
