import React from "react";
import Header from "../../../components/Header";
import MenuItem from "../../../components/MenuItem";

const AppointmentMenu = () => {
  return (
    <div className="admin-menu">
      <Header />
      <MenuItem label="Agendamentos Feitos" link="/admin/select-appointment" />
      <MenuItem label="Verificar Horários Livres" link="/admin/free-schedules" />
      {/* <MenuItem label="Agendar" link="/admin/create-appointment" /> */}
      <MenuItem
        src="../../public/arrow-icon.png"
        alt="icone de voltar"
        link="/admin/menu"
        label="Voltar"
        color="#EC221F"
      />
    </div>
  );
};

export default AppointmentMenu;
