import React, { useState } from "react";
import "./styles.css";
import Header from "../../../components/Header";
import ComboBoxItem from "../../../components/ComboBoxItem";
import InputItem from "../../../components/InputItem";
import CheckBoxItem from "../../../components/checkBoxItem";
import TableInputItem from "../../../components/TableInputItem";
import RadioItem from "../../../components/RadioItem";
import FormButton from "../../../components/FormButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    name: yup.string().required("Campo obrigatorio"),
    typeCourt: yup.string().required("Campo obigatorio"),
    timeDivision: yup.string(),
    percent: yup.number().required("Campo obrigatorio"),
    sunday: yup.string(),
    sundayHour: yup.string(),
    sundayInitial: yup.string(),
    sundayEnd: yup.string(),
    monday: yup.string(),
    mondayHour: yup.string(),
    mondayInitial: yup.string(),
    mondayEnd: yup.string(),
    tuesday: yup.string(),
    tuesdayHour: yup.string(),
    tuesdayInitial: yup.string(),
    tuesdayEnd: yup.string(),
    wednesday: yup.string(),
    wednesdayHour: yup.string(),
    wednesdayInitial: yup.string(),
    wednesdayEnd: yup.string(),
    thursday: yup.string(),
    thursdayHour: yup.string(),
    thursdayInitial: yup.string(),
    thursdayEnd: yup.string(),
    friday: yup.string(),
    fridayHour: yup.string(),
    fridayInitial: yup.string(),
    fridayEnd: yup.string(),
    saturday: yup.string(),
    saturdayHour: yup.string(),
    saturdayInitial: yup.string(),
    saturdayEnd: yup.string(),
    holyday: yup.string(),
    holydayHour: yup.string(),
    holydayInitial: yup.string(),
    holydayEnd: yup.string(),
  })
  .required();

const CreateCourt = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const [selectedValue, setSelectedValue] = useState()

  console.log(selectedValue)
  return (
    <div className="create-court">
      <Header />
      <form className="create-court__form">
        <InputItem
          control={control}
          errorMessage={errors?.name?.message}
          name="name"
          label="Nome da Quadra"
          placeholder="nome da quadra"
        />
        <ComboBoxItem
          control={control}
          errorMessage={errors?.typeCourt?.message}
          name="typeCourt"
          label="tipo da quadra"
          placeholder="selecione o tipo da quadra"
          options={["teste1", "teste2"]}
          onChange={setSelectedValue}
        />
        <p className="create-court__sutitle">
          Selcione os dias de funcionamento
        </p>
        <div className="create-court__table-header">
          <p>Valor da hora</p>
          <p>Horário de funcionamento</p>
          <p>Horário de encerramento</p>
        </div>

        <div className="create-court__table-row">
          <CheckBoxItem control={control} label="Domingo" name="sunday" />
          <div className="create-court__table-inputs">
            <TableInputItem control={control} name="sundayHour" />
            <TableInputItem control={control} name="sundayInitial" />
            <TableInputItem control={control} name="sundayEnd" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem control={control} label="Segunda" name="monday" />
          <div className="create-court__table-inputs">
            <TableInputItem control={control} name="mondayHour" />
            <TableInputItem control={control} name="mondayInitial" />
            <TableInputItem control={control} name="mondayEnd" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem control={control} label="Terça" name="tuesday" />
          <div className="create-court__table-inputs">
            <TableInputItem control={control} name="tuesdayHour" />
            <TableInputItem control={control} name="tuesdayInitial" />
            <TableInputItem control={control} name="tuesdayEnd" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem control={control} label="Quarta" name="wednesday" />
          <div className="create-court__table-inputs">
            <TableInputItem control={control} name="wednesdayHour" />
            <TableInputItem control={control} name="wednesdayInitial" />
            <TableInputItem control={control} name="wednesdayEnd" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem control={control} label="Quinta" name="thursday" />
          <div className="create-court__table-inputs">
            <TableInputItem control={control} name="thursdayHour" />
            <TableInputItem control={control} name="thursdayInitial" />
            <TableInputItem control={control} name="thursdayEnd" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem control={control} label="Sexta" name="friday" />
          <div className="create-court__table-inputs">
            <TableInputItem control={control} name="fridayHour" />
            <TableInputItem control={control} name="fridayInitial" />
            <TableInputItem control={control} name="fridayEnd" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem control={control} label="Sabado" name="saturday" />
          <div className="create-court__table-inputs">
            <TableInputItem control={control} name="saturdayHour" />
            <TableInputItem control={control} name="saturdayInitial" />
            <TableInputItem control={control} name="saturdayEnd" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem control={control} label="Feriados" name="holyday" />
          <div className="create-court__table-inputs">
            <TableInputItem control={control} name="holydayHour" />
            <TableInputItem control={control} name="holydayInitial" />
            <TableInputItem control={control} name="holydayEnd" />
          </div>
        </div>

        <p className="create-court__sutitle">
          Como serão divididos os horarios?
        </p>
        <div>
          <RadioItem
            control={control}
            label="30 Minutos"
            name="timeDivision"
            value="30 Minutos"
          />
          <RadioItem
            control={control}
            label="1 hora"
            name="timeDivision"
            value="1 hora"
          />
        </div>
        <p className="create-court__sutitle">
          Defina o percentual do sinal a ser pago (%):
        </p>
        <InputItem
          control={control}
          errorMessage={errors?.percent?.message}
          name="percent"
          label="Percentual do Sinal"
          placeholder="Percentual do Sinal"
          type="number"
        />

        <FormButton label="Cadastrar" />
        
      </form>
    </div>
  );
};

export default CreateCourt;
