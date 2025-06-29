import React from "react";
import "./styles.css";
import Header from "../../../components/Header";
import InputItem from "../../../components/InputItem";
import ButtonItem from "../../../components/ButtonItem";
import { api } from "../../../services/api";
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

const AdminRecovery = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const navigate = useNavigate()
  const onSubmit = async (formData)=>{
    console.log(formData);
    const response = await api.post(`/api/admin/recover/password/${formData.email}?newPassword=${formData.newPassword}`);
    console.log(response);
    if (response.status == 200){
      navigate("/admin/recovery/email");
    }else{
      alert("algo deu errado");
    }
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
          <InputItem
            label="Nova Senha"
            placeholder="Redefina sua senha"
            control={control}
            name="newPassword"
          />
          <FormButton label="Recuperar Senha"/>
        </form>
      </div>
    </>
  );
};

export default AdminRecovery;
