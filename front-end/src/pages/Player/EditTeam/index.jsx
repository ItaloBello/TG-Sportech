import React from "react";
import "./styles.css";
import InputItem from "../../../components/InputItem";
import ButtonItem from "../../../components/ButtonItem";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormButton from "../../../components/FormButton";
import Header from "../../../components/Header";

//TODO integrar

const schema = yup
  .object({
    name: yup.string().required("Campo obigatorio"),
    primaryColor: yup.string().required("Campo obrigatorio"),
    secondaryColor: yup.string().required("Campo obrigatorio"),
  })
  .required();

const EditTeam = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  return (
    <div className="edit-team">
      <Header link={1}/>
      <div className="edit-team__header">
        <p>Editar Time</p>
        <img
          src="../../../public/add-img-team.png"
          alt="adicione a imagem time"
        />
      </div>
      <form>
        <InputItem
          label="Nome do Time"
          placeholder="Time"
          control={control}
          errorMessage={errors?.name?.message}
          name="name"
        />
        <InputItem
          label="Cor Primaria"
          placeholder="Cor"
          control={control}
          errorMessage={errors?.primaryColor?.message}
          name="primaryColor"
        />
        <InputItem
          label="Cor Secundaria"
          placeholder="Cor"
          control={control}
          errorMessage={errors?.secondaryColor?.message}
          name="secondaryColor"
        />
        <div className="edit-team__button-area">
          <ButtonItem
            label="Cancelar"
            link="/player/show-team"
            color="#EC221F"
          />
          <FormButton label="Salvar" />
        </div>
      </form>
      
      <div className="edit-team__players-table">
        <div className="players-table__header">
          <p>Jogadores</p>
        </div>
        <div className="players-table__row">
          <div className="row__name-area">
            <span>Jefão</span>
            <span>C</span>
          </div>
          <button onClick={()=>console.log('clicou')} className="row__button">X</button>
        </div>
        <div className="players-table__row">
          <div className="row__name-area">
            <span>Messi</span>
          </div>
          <button onClick={()=>console.log('clicou')} className="row__button">X</button>
        </div>
      </div>
    </div>
  );
};

export default EditTeam;
