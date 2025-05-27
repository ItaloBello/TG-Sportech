import React from "react";
import Header from "../../../components/Header";
import * as yup from "yup";
import InputItem from "../../../components/InputItem";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormButton from "../../../components/FormButton";
import { useAdminAuth } from "../../../hooks/useAdminAuth";


//TODO GERAR INTEGRAÇÂO

const schema = yup
  .object({
    name: yup.string().required("Campo Obrigatorio"),
    cep: yup.string().required("Campo Obrigatorio"),
    street: yup.string().required("Campo Obrigatorio"),
    number: yup.string().required('Campo Obrigatorio'),
    city: yup.string().required("Campo Obrigatorio"),
    initial: yup.string().required("Campo Obrigatorio"),
    end: yup.string().required("Campo Obrigatorio")
  })
  .required();

const RegisterEstab = () => {

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (dataForm) =>{

    console.log(dataForm);
    
  }
  return (
    <div>
      <Header />
      <p>Dados do Estabelecimento</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputItem
          label="Nome do Estabelecimento"
          placeholder="Estabelecimento"
          control={control}
          errorMessage={errors?.name?.message}
          name="name"
        />
        <InputItem
          label="CEP"
          placeholder="CEP"
          control={control}
          errorMessage={errors?.cep?.message}
          name="cep"
        />
        <InputItem
          label="Rua"
          placeholder="Rua"
          control={control}
          errorMessage={errors?.street?.message}
          name="street"
        />
        <InputItem
          label="Número"
          placeholder="Número"
          control={control}
          errorMessage={errors?.number?.message}
          name="number"
        />
        <InputItem
          label="Cidade/Estado"
          placeholder="Cidade/Estado"
          control={control}
          errorMessage={errors?.city?.message}
          name="city"
        />
        <InputItem
          label="Início do Funcionamento"
          placeholder="Início do Funcionamento"
          control={control}
          errorMessage={errors?.initial?.message}
          name="initial"
        />
        <InputItem
          label="Fim do Funcionamento"
          placeholder="Fim do Funcionamento"
          control={control}
          errorMessage={errors?.end?.message}
          name="end"
        />

        <FormButton label="Cadastrar" />
      </form>
      
    </div>
  );
};

export default RegisterEstab;
