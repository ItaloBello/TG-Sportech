import React, { useEffect } from "react";
import Header from "../../../components/Header";
import AppointmentCard from "../../../components/AppointmentCard";
import "./styles.css";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";

//TODO Integrar

// TODO vou precisar de uma requisição que eu envie um id de agendamento ela me retorna: tipo de agendamento (Amistoso ou rachão), se for amistoso, me retorna o nome do adversário, a data,, dai ela verifica o status do agendamento e me retorna uma dessas coisas
// 	- Pagamento pendente: Ambos //quando nenhum dos dois time pagou ainda
// 	- Pagamento pendente: 'nome do time' //quando um time pagou, mas o outro não, no caso, retorne junto o nome do time
// 	- Pago //quando os dois times já pagaram
// 	- Jogado // Quando já foi realizada a partida

const MyAppointments = () => {
  const { player, myAppointments, handleGetMyAppointments } = usePlayerAuth();
  useEffect(() => {
    if (!player || !player.id) {
      console.log('Aguardando player carregar...', player);
      return;
    }
    console.log('Buscando agendamentos para o player:', player.id);
    handleGetMyAppointments();
    // Não logar myAppointments aqui, pois ele só atualiza depois
  }, [player]);
  return (
    <div className="my-appointments">
      <Header link={1}/>
      <div className="appointment-list">
        {myAppointments.map((appointment, index) => (
          <AppointmentCard
            date={appointment.date}
            status={appointment.status}
            times={appointment.times}
            type={appointment.type}
            adversary={appointment.adversary}
            court={appointment.court}
            key={index}
          />
        ))}
       
      </div>
    </div>
  );
};

export default MyAppointments;
