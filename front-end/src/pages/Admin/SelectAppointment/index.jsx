import React from "react";
import "./styles.css";
import Header from "../../../components/Header";
import AppointmentCard from "../../../components/AppointmentCard";

const SelectAppointment = () => {
  return (
    <div className="select-appointment">
      <Header />
      <div className="select-appointment__main">
        <AppointmentCard
          date={"1/1/2000"}
          status={"Pagamento Pendente"}
          times={["19:00-20:00"]}
          type={"Rachão"}
          court="quadra cabecinha"
          toEdit={true}
        />
      </div>
    </div>
  );
};

export default SelectAppointment;
