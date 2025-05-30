import React from "react";
import InputItem from "../../../components/InputItem";
import ButtonItem from "../../../components/ButtonItem";
import "./styles.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Header from "../../../components/Header";

const schema = yup
  .object({
    name: yup.string().required("Campo obigatorio"),
    primaryColor: yup.string().required("Campo obrigatorio"),
    secondaryColor: yup.string().required("Campo obrigatorio"),
  })
  .required();

const ViewTeam = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  return (
    // esta tela os inputs terão valores fixos e não serão alterados
    <div className="view-team">
      <Header link={1}/>
      <div className="view-team__header">
        <p>Time</p>
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
          isDisabled={true}
        />
        <InputItem
          label="Cor Primaria"
          placeholder="Cor"
          control={control}
          errorMessage={errors?.primaryColor?.message}
          name="primaryColor"
          isDisabled={true}
        />
        <InputItem
          label="Cor Secundaria"
          placeholder="Cor"
          control={control}
          errorMessage={errors?.secondaryColor?.message}
          name="secondaryColor"
          isDisabled={true}
        />
        <div className="view-team__button-area">
          <ButtonItem label="OK" link="/player/show-team" className="a" />
        </div>
      </form>
    </div>
  );
};

export default ViewTeam;
