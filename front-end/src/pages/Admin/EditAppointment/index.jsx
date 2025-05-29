import React, { useEffect, useState } from "react";
import './styles.css'
import Header from "../../../components/Header";
import ComboBoxItem from "../../../components/ComboBoxItem";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormButton from "../../../components/FormButton";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

//TODO GERAR INTEGRAÇÂO

const schema = yup
  .object({
    playerSignal: yup.string(),
    team1Signal: yup.string(),
    team2Signal: yup.string()
  })
  .required();

const EditAppointment = () => {
  const {selectedAppointment} = useAdminAuth()
  const appointmentType = "amistoso";

  const [playerSignal, setPlayerSignal] = useState();
  const [team1Signal, setTeam1Signal] = useState();
  const [team2Signal, setTeam2Signal] = useState();

  useEffect(()=>{
    console.log(selectedAppointment)
  },[])

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
      playerSignal: playerSignal ? playerSignal : undefined,
      team1Signal: team1Signal ? team1Signal : undefined,
      team2Signal: team2Signal ? team2Signal : undefined,
    };
    console.log(payload);
  };
  return (
    <div className="edit-appointment">
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="edit-appointment__main">
          {appointmentType == "rachão" ? (
            <ComboBoxItem
              control={control}
              label="Sinal foi pago"
              options={["sim", "não"]}
              name="playerSignal"
              onChange={setPlayerSignal}
            />
          ) : (
            <>
            <ComboBoxItem
              control={control}
              label="Sinal do time 1 foi pago"
              options={["sim", "não"]}
              name="team1Signal"
              onChange={setTeam1Signal}
            />
            <ComboBoxItem
              control={control}
              label="Sinal do time 2 foi pago"
              options={["sim", "não"]}
              name="team2Signal"
              onChange={setTeam2Signal}
            />
            </>
          )}
        </div>
        <FormButton label="Salvar e sair"/>
      </form>
    </div>
  );
};

export default EditAppointment;
