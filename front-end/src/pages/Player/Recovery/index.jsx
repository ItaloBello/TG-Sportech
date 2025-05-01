import React from "react";
import "./styles.css";
import Header from "../../../components/Header";
import InputItem from "../../../components/InputItem";
import ButtonItem from "../../../components/ButtonItem";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().required()

const PlayerRecovery = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  return (
    <>
      <div className="main">
        <Header />
        <InputItem label="Usuário" placeholder="Usuário" control={control} name=''/>
        <ButtonItem
          color="#14ae5c"
          label="Recuperar Senha"
          link="/player/recovery/sms"
        />
      </div>
    </>
  );
};

export default PlayerRecovery;
