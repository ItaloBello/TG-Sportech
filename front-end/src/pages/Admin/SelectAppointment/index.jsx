import React, { useEffect, useState } from "react";
import "./styles.css";
import Header from "../../../components/Header";
import AppointmentCard from "../../../components/AppointmentCard";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

//TODO GERAR INTEGRAÇÂO

const SelectAppointment = () => {
  const { admin, appointments, handleGetAppointmens } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        await handleGetAppointmens(admin.id);
      } finally {
        setIsLoading(false);
      }
    };
    getAppointments();

    console.log(appointments);
  }, [admin.id]);

  const handleDelete = (id)=>{
    console.log('deletou', id)
  }

if(isLoading) return <></>

  return (
    <div className="select-appointment">
      <Header />
      <div className="select-appointment__main">
        {appointments.map((appointment, index) => (
          <AppointmentCard
            date={appointment.date}
            status={appointment.status}
            times={appointment.times}
            type={appointment.type}
            adversary={appointment.adversary}
            player={appointment.player}
            court={appointment.court}
            toEdit={true}
            key={index}
            id={appointment.id}
            dell = {()=>handleDelete(appointment.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectAppointment;
