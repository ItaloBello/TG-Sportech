import React from "react";
import "./styles.css";
import Header from "../../../components/Header";
import * as yup from "yup";
import InputItem from "../../../components/InputItem";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormButton from "../../../components/FormButton";

const schema = yup
  .object({
    name: yup.string().required("Campo obigatorio"),
    email: yup.string().email("Email inválido").required("Campo Obrigatorio"),
    cellphone: yup.string().required("Campo obrigatorio"),
    cpf: yup.string().required("Campo obrigatorio"),
    password: yup.string().required("Campo obrigatorio"),
    confirmPassword: yup.string().required("Campo Obrigatorio"),
  })
  .required();

export const PlayerSingUp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const { handleSingUp } = usePlayerAuth();

  //funçao de POST
  const onSubmit =  (formData) => {
    handleSingUp(formData);
    console.log(formData);
  };

  return (
    <>
      <div className="main">
        <Header />
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputItem
            label="Nome do Usuário"
            placeholder="Usuário"
            control={control}
            errorMessage={errors?.name?.message}
            name={"name"}
            type={"text"}
          />
          <InputItem
            label="Email"
            placeholder="Email"
            control={control}
            errorMessage={errors?.email?.message}
            name={"email"}
            type={"email"}
          />
          <InputItem
            label="Celular"
            placeholder="Celular"
            control={control}
            errorMessage={errors?.cellphone?.message}
            name={"cellphone"}
            type={"text"}
          />
          <InputItem
            label="CPF"
            placeholder="CPF"
            control={control}
            errorMessage={errors?.cpf?.message}
            name={"cpf"}
            type={"text"}
          />
          <InputItem
            label="Senha"
            placeholder="Senha"
            control={control}
            errorMessage={errors?.password?.message}
            name={"password"}
            type={"password"}
          />
          <InputItem
            label="Confirme a Senha"
            placeholder="Confirme a Senha"
            control={control}
            errorMessage={errors?.confirmPassword?.message}
            name={"confirmPassword"}
            type={"password"}
          />
          <FormButton label="Cadastrar" />
        </form>
      </div>
    </>
  );
};
