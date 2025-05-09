import React from "react";
import "./styles.css";
import InputItem from "../../../components/InputItem";
import ButtonItem from "../../../components/ButtonItem";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormButton from "../../../components/FormButton";

const schema = yup
  .object({
    name: yup.string().required("Campo obigatorio"),
    primaryColor: yup.string().required("Campo obrigatorio"),
    secondaryColor: yup.string().required("Campo obrigatorio"),
  })
  .required();

const EditTeam = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  return (
    <div className="edit-team">
      <div className="edit-team__header">
        <p>Editar Time</p>
        <img
          src="../../../public/add-img-team.png"
          alt="adicione a imagem time"
        />
      </div>
      <form>
        <InputItem
          label="Nome do Time"
          placeholder="Time"
          control={control}
          errorMessage={errors?.name?.message}
          name="name"
        />
        <InputItem
          label="Cor Primaria"
          placeholder="Cor"
          control={control}
          errorMessage={errors?.primaryColor?.message}
          name="primaryColor"
        />
        <InputItem
          label="Cor Secundaria"
          placeholder="Cor"
          control={control}
          errorMessage={errors?.secondaryColor?.message}
          name="secondaryColor"
        />
        <div className="edit-team__button-area">
          <ButtonItem
            label="Cancelar"
            link="/player/show-team"
            color="#EC221F"
          />
          <FormButton label="Salvar" />
        </div>
      </form>
      {/* TODO: Criar a tabela de jogadores dentro do time, mostrar o capitao, colocar um botao de X para remover alguem do time */}
    </div>
  );
};

export default EditTeam;
