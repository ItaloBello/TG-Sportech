import React from "react";
import "./styles.css";
import InputItem from "../../components/InputItem";
import ButtonItem from "../../components/ButtonItem";
import { usePlayerAuth } from "../../hooks/usePlayerAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    name: yup.string(),
    email: yup.string().email(),
    cellphone: yup.string(),
    cpf: yup.string(),
  })
  .required();

const PlayerProfile = () => {
  const { player } = usePlayerAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

//TODO: colocar a requisição PUT do axios 


  return (
    <div className="player-profile">
      <form>
        <img
          className="player-profile__image"
          src="../../public/profile-placeholder-icon.png"
          alt="placeholdr da foto de perfil"
        />
        <InputItem
          label="Usuario"
          placeholder={player.name}
          type="text"
          name="name"
          control={control}
          errorMessage={errors?.name?.message}
        />
        <InputItem
          label="Email"
          placeholder={player.email}
          type="email"
          name="email"
          control={control}
          errorMessage={errors?.email?.message}
        />
        <InputItem
          label="Celular"
          placeholder={player.cellphone}
          type="text"
          name="cellphone"
          control={control}
          errorMessage={errors?.cellphone?.message}
        />
        <InputItem
          label="CPF"
          placeholder={player.cpf}
          type="text"
          name="cpf"
          control={control}
          errorMessage={errors?.cpf?.message}
        />
        <ButtonItem color="#14ae5c" label="Sair e Salvar" link="/player/menu" />
      </form>
    </div>
  );
};

export default PlayerProfile;
