import React from "react";
import "./styles.css";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputItem from "../../components/InputItem";
import FormButton from "../../components/FormButton";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { Link } from "react-router-dom";

const schema = yup
  .object({
    name: yup.string().required("Campo obigatorio"),
    password: yup.string().required("Campo obrigatorio"),
  })
  .required();

const AdminLogin = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const {} = useAdminAuth();

  //funcao de login

  return (
    <>
      <div className="main">
        <Header />
        <form className="admin-login__form">
          <InputItem
            control={control}
            errorMessage={errors?.name?.message}
            label="email"
            name="name"
            placeholder="email"
            type="text"
          />
          <InputItem
            control={control}
            errorMessage={errors?.password?.message}
            label="senha"
            name="password"
            placeholder="senha"
            type="password"
          />
          <Link className="link__message">
            <p>Esqueceu a senha, paizao</p>
          </Link>
          <FormButton label="entrar" />
        </form>
      </div>
      <p className="admin-login__p">
        Não possúi cadastro?{"  "}
        <Link className="link__message">
          Cadastre-se
        </Link>
      </p>
    </>
  );
};

export default AdminLogin;
