import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputItem from "../../components/InputItem";
import FormButton from "../../components/FormButton";
import { usePlayerAuth } from "../../hooks/usePlayerAuth";

const schema = yup.object({
  name: yup.string().required("Campo obigatorio"),
  password: yup.string().required("Campo obrigatorio"),
}).required()

const PlayerLogin = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const {handleLogin} = usePlayerAuth()

  //funcao do login
  const onSubmit = (dataForm) =>{
    handleLogin(dataForm)
  }

  return (
    <>
      <div className="main">
        <Header />
        <form className="player-login__form" onSubmit={handleSubmit(onSubmit)}>
          <InputItem
            label="Nome do Usuário"
            placeholder="Usuário"
            type="text"
            name="name"
            control={control}
            errorMessage={errors?.name?.message}
          />
          <InputItem
            label="Senha"
            placeholder="Senha"
            type="password"
            name="password"
            control={control}
            errorMessage={errors?.name?.message}
          />

          <Link className="link__message" to="/player/recovery">
            <p>Esqueceu a senha, jogador?</p>
          </Link>
          <FormButton label="Entrar" />
        </form>
      </div>
      <p className="player-login__p">
        Não possúi cadastro?{"  "}
        <Link to={"/player/singup"} className="link__message">
          Cadastre-se
        </Link>
      </p>
    </>
  );
};

export default PlayerLogin;
