import React from "react";
import "./styles.css";
import Header from "../../../components/Header";
import InputItem from "../../../components/InputItem";
import ButtonItem from "../../../components/ButtonItem";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormButton from "../../../components/FormButton";
import { useNavigate } from "react-router-dom";


//TODO Integrar
const schema = yup
  .object({
    name: yup.string(),
  })
  .required();

const PlayerRecovery = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const navigate = useNavigate()
  const onSubmit = (formData)=>{
    console.log(formData);
    navigate("/player/recovery/email")
  }
  return (
    <>
      <div className="main">
        <Header />
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputItem
            label="Email"
            placeholder="Digite seu email"
            control={control}
            name="email"
          />
          <FormButton label="Recuperar Senha"/>
        </form>
      </div>
    </>
  );
};

export default PlayerRecovery;
