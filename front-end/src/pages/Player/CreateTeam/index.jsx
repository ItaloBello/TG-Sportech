import React from "react";
import InputItem from "../../../components/InputItem";
import ButtonItem from "../../../components/ButtonItem";
import "./styles.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormButton from "../../../components/FormButton";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";

//TODO Integrar

const schema = yup
  .object({
    name: yup.string().required("Campo obigatorio"),
    primaryColor: yup.string().required("Campo obrigatorio"),
    secondaryColor: yup.string().required("Campo obrigatorio"),
    inviteCode: yup.string(),
  })
  .required();

const copyCode = async () => {
  const code = document.getElementById("btnCopy").value;
  try {
    await navigator.clipboard.writeText(code);
  } catch (error) {
    console.log(error);
  }
};

const CreateTeam = () => {
  const { handleCreateTeam, player } = usePlayerAuth()

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
      userId:player.id
    }
    
    
    handleCreateTeam(payload);
  }

  return (
    <div className="create-team">
      <div className="create-team__header">
        <p className="create-team__title">Criar Time</p>
        <img
          className="create-team__image"
          src="../../public/add-img-team.png"
          alt="adicionar imagem do time"
        />
        <p className="create-team__image-label">Logo do Time</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        
      <InputItem
        label="Nome do Time"
        placeholder="Time"
        control={control}
        errorMessage={errors?.name?.message}
        name="name"
        type="text"
        />
      <InputItem
        label="Cor Primaria"
        placeholder="Cor"
        control={control}
        errorMessage={errors?.primaryColor?.message}
        name="primaryColor"
        type="text"
        />
      <InputItem
        label="Cor Secundaria"
        placeholder="Cor"
        control={control}
        errorMessage={errors?.secondaryColor?.message}
        name="secondaryColor"
        type="text"
        />
      <div className="create-team__input-and-button">
        <InputItem
          id="btnCopy"
          placeholder={"Code"}
          label={"Invite Code"}
          control={control}
          errorMessage={errors?.inviteCode?.message}
          name="inviteCode"
          type="text"
          isDisabled={true}
        />
        <ButtonItem
          label={"Copiar"}
          link={"/player/create-team"}
          color={"#ffffff"}
          onClick={copyCode}
          />
      </div>
      <div className="create-team__button-area">
        <ButtonItem
          label={"Cancelar"}
          link={"/player/team-menu"}
          color={"#EC221F"}
          />
        <FormButton
          label={"Salvar"}
          
          
          />
      </div>
          </form>
    </div>
  );
};

export default CreateTeam;
