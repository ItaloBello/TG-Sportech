import React from "react";
import Header from "../../../components/Header";
import MenuItem from "../../../components/MenuItem";

//OK

const CourtMenu = () => {
  return (
    <div className="court-menu">
      <Header />
      <MenuItem label="Adicionar Quadra" link='/admin/create-court'/>
      <MenuItem label="Editar Quadra" link='/admin/select-court'/>
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

export default CourtMenu;
