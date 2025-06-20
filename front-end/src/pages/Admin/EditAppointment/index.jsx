import React, { useEffect, useState } from "react";
import { notifySuccess, notifyError } from '../../../utils/notify';
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
  const {selectedAppointment, handleSelectedType} = useAdminAuth()
  const [appointmentType, setAppointmentType] = useState("");
  const [playerSignal, setPlayerSignal] = useState();
  const [team1Signal, setTeam1Signal] = useState();
  const [team2Signal, setTeam2Signal] = useState();

  useEffect(() => {
    let appointmentId = null;
    if (selectedAppointment) {
      if (typeof selectedAppointment === "object" && selectedAppointment.id) {
        appointmentId = selectedAppointment.id;
      } else if (typeof selectedAppointment === "number" || typeof selectedAppointment === "string") {
        appointmentId = selectedAppointment;
      }
    }
    if (appointmentId) {
      handleSelectedType(appointmentId).then((data) => {
        if (data && data.type) {
          setAppointmentType(data.type);
        }
      });
    }
  }, [selectedAppointment]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      playerSignal: playerSignal ? playerSignal : undefined,
      team1Signal: team1Signal ? team1Signal : undefined,
      team2Signal: team2Signal ? team2Signal : undefined,
    };
    console.log(payload);

    // Checa se todos os campos relevantes são 'sim'
    let allPaid = false;
    if (appointmentType === "rachão") {
      allPaid = payload.playerSignal === "sim";
    } else {
      allPaid = payload.team1Signal === "sim" && payload.team2Signal === "sim";
    }

    if (allPaid) {
      let appointmentId = null;
      if (selectedAppointment) {
        if (typeof selectedAppointment === "object" && selectedAppointment.id) {
          appointmentId = selectedAppointment.id;
        } else if (typeof selectedAppointment === "number" || typeof selectedAppointment === "string") {
          appointmentId = selectedAppointment;
        }
      }
      if (appointmentId) {
        try {
          const response = await fetch(`http://localhost:8081/api/admin/agendamentos/pagamento/confirmar/${appointmentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const result = await response.json();
          if (response.ok) {
            notifySuccess('Pagamento confirmado com sucesso!');
          } else {
            notifyError(result.error || 'Erro ao confirmar pagamento.');
          }
        } catch (err) {
          notifyError('Erro ao conectar ao servidor.');
        }
      } else {
        notifyError('ID do agendamento não encontrado.');
      }
    }
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