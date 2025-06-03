import React from "react";
import Header from "../../../components/Header";
import "./styles.css";
import ButtonItem from "../../../components/ButtonItem";
import InputItem from "../../../components/InputItem";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormButton from "../../../components/FormButton";

//TODO Integrar

const schema = yup
  .object({ inviteCode: yup.string().required("Campo obigatorio") })
  .required();
 
const JoinTeam = () => {
  const { handleJoinTeam, player } = usePlayerAuth();
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
      userId: player.id,
    };
    
    console.log(payload);
    handleJoinTeam(payload)

  };

  return (
    <div className="join-team">
      <Header link={1}/>
      <p className="join-team__text">
        Insira o invite code do time que deseja entrar no campo abaixo.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
      <InputItem
        label="Invite Code"
        placeholder="Code"
        control={control}
        errorMessage={errors?.inviteCode?.message}
        name="inviteCode"
        type="text"
      />
      <FormButton label="Entrar"/>
      </form>
    </div>
  );
};

export default JoinTeam;
