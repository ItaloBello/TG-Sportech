import React, { useEffect, useState } from "react";
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
import { useAdminAuth } from "../../../hooks/useAdminAuth";

//TODO GERAR INTEGRAÇÂO

const schema = yup
  .object({
    name: yup.string().required("Campo obrigatorio"),
    typeCourt: yup.string(),
    timeDivision: yup.string(),
    percent: yup.number().required("Campo obrigatorio"),
    sunday: yup.boolean(),
    sundayHour: yup.number("deve ser um número"),
    sundayInitial: yup.string(),
    sundayEnd: yup.string(),
    monday: yup.boolean(),
    mondayHour: yup.number("deve ser um número"),
    mondayInitial: yup.string(),
    mondayEnd: yup.string(),
    tuesday: yup.boolean(),
    tuesdayHour: yup.number("deve ser um número"),
    tuesdayInitial: yup.string(),
    tuesdayEnd: yup.string(),
    wednesday: yup.boolean(),
    wednesdayHour: yup.number("deve ser um número"),
    wednesdayInitial: yup.string(),
    wednesdayEnd: yup.string(),
    thursday: yup.boolean(),
    thursdayHour: yup.number("deve ser um número"),
    thursdayInitial: yup.string(),
    thursdayEnd: yup.string(),
    friday: yup.boolean(),
    fridayHour: yup.number("deve ser um número"),
    fridayInitial: yup.string(),
    fridayEnd: yup.string(),
    saturday: yup.boolean(),
    saturdayHour: yup.number("deve ser um número"),
    saturdayInitial: yup.string(),
    saturdayEnd: yup.string(),
  })
  .required();

const EditCourt = () => {
  const { admin, handleGetCourt, handleEditCourt, selectedCourt, court } = useAdminAuth();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const [selectedValue, setSelectedValue] = useState();
  const [selectedDays, setSelectedDays] = useState([]);

  // Buscar quadra ao montar
  useEffect(() => {
    handleGetCourt(selectedCourt);
  }, []);

  // Popular formulário quando os dados da quadra chegarem
  useEffect(() => {
    if (court && court.quadra) {
      setValue("name", court.quadra.nome || "");
      setValue("typeCourt", court.quadra.tipo || "");
      setValue("timeDivision", court.quadra.meioSlot ? "30 Minutos" : "1 hora");
      setValue("percent", (court.quadra.porcSinal || 0) * 100);

      setSelectedValue(court.quadra.tipo || "");

    }
  }, [court, setValue]);

  const handleChange = (label, isChecked) => {
    setSelectedDays((prev) => {
      if (isChecked) return [...prev, label];
      else return prev.filter((item) => item !== label);
    });
  };

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      typeCourt: selectedValue,
      weekDays: selectedDays,
      id: court.quadra.id,
    };
    console.log(payload);
    handleEditCourt(payload)
  };
  return (
    <div className="create-court">
      <Header />
      <form className="create-court__form" onSubmit={handleSubmit(onSubmit)}>
        <InputItem
          control={control}
          errorMessage={errors?.name?.message}
          name="name"
          label="Nome da Quadra"
          placeholder={court.nome}
        />
        <ComboBoxItem
          control={control}
          errorMessage={errors?.typeCourt?.message}
          name="typeCourt"
          label="tipo da quadra"
          placeholder="selecione o tipo da quadra"
          options={["society", "gramado"]}
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
          <CheckBoxItem
            control={control}
            label="Domingo"
            name="sunday"
            onChange={handleChange}
          />
          <div className="create-court__table-inputs">
            <TableInputItem control={control} name="sundayHour" type="number" />
            <TableInputItem
              control={control}
              name="sundayInitial"
              type="time"
            />
            <TableInputItem control={control} name="sundayEnd" type="time" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem
            control={control}
            label="Segunda"
            name="monday"
            onChange={handleChange}
          />
          <div className="create-court__table-inputs">
            <TableInputItem control={control} name="mondayHour" type="number" />
            <TableInputItem
              control={control}
              name="mondayInitial"
              type="time"
            />
            <TableInputItem control={control} name="mondayEnd" type="time" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem
            control={control}
            label="Terça"
            name="tuesday"
            onChange={handleChange}
          />
          <div className="create-court__table-inputs">
            <TableInputItem
              control={control}
              name="tuesdayHour"
              type="number"
            />
            <TableInputItem
              control={control}
              name="tuesdayInitial"
              type="time"
            />
            <TableInputItem control={control} name="tuesdayEnd" type="time" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem
            control={control}
            label="Quarta"
            name="wednesday"
            onChange={handleChange}
          />
          <div className="create-court__table-inputs">
            <TableInputItem
              control={control}
              name="wednesdayHour"
              type="number"
            />
            <TableInputItem
              control={control}
              name="wednesdayInitial"
              type="time"
            />
            <TableInputItem control={control} name="wednesdayEnd" type="time" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem
            control={control}
            label="Quinta"
            name="thursday"
            onChange={handleChange}
          />
          <div className="create-court__table-inputs">
            <TableInputItem
              control={control}
              name="thursdayHour"
              type="number"
            />
            <TableInputItem
              control={control}
              name="thursdayInitial"
              type="time"
            />
            <TableInputItem control={control} name="thursdayEnd" type="time" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem
            control={control}
            label="Sexta"
            name="friday"
            onChange={handleChange}
          />
          <div className="create-court__table-inputs">
            <TableInputItem control={control} name="fridayHour" type="number" />
            <TableInputItem
              control={control}
              name="fridayInitial"
              type="time"
            />
            <TableInputItem control={control} name="fridayEnd" type="time" />
          </div>
        </div>
        <div className="create-court__table-row">
          <CheckBoxItem
            control={control}
            label="Sabado"
            name="saturday"
            onChange={handleChange}
          />
          <div className="create-court__table-inputs">
            <TableInputItem
              control={control}
              name="saturdayHour"
              type="number"
            />
            <TableInputItem
              control={control}
              name="saturdayInitial"
              type="time"
            />
            <TableInputItem control={control} name="saturdayEnd" type="time" />
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

        <FormButton label="Salvar e sair" />
      </form>
    </div>
  );
};

export default EditCourt;
