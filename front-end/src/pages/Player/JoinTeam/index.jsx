import React from "react";
import Header from "../../../components/Header";
import "./styles.css";
import ButtonItem from "../../../components/ButtonItem";
import InputItem from "../../../components/InputItem";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({ inviteCode: yup.string().required("Campo obigatorio") })
  .required();

const JoinTeam = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  return (
    <div className="join-team">
      <Header />
      <p className="join-team__text">
        Insira o invite code do time que deseja entrar no campo abaixo.
      </p>
      <InputItem
        label="Invite Code"
        placeholder="Code"
        control={control}
        errorMessage={errors?.inviteCode?.message}
        name="inviteCode"
        type="text"
      />
      <ButtonItem color="#14ae5c" label="Entrar" link="" />
    </div>
  );
};

export default JoinTeam;
