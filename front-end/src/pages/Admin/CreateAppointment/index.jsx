import React, { useEffect, useLayoutEffect, useState } from "react";
import Header from "../../../components/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormButton from "../../../components/FormButton";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ComboBoxItem from "../../../components/ComboBoxItem";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import CheckBoxItem from "../../../components/checkBoxItem";
import { data, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../../hooks/useAdminAuth";
import InputItem from "../../../components/InputItem";

const schema = yup
  .object({
    date: yup.date(),
    court: yup.string(),
    name: yup.string(),
  })
  .required();

const CreateAppointment = () => {
  const { admin } = useAdminAuth();

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const moreDays = 30;
  const minDate = new Date(Date.now());
  const maxDate = new Date(Date.now() + moreDays * 24 * 60 * 60 * 1000);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const handleFilterWeekDays = (date) => {
    return !weekDaysToFilter.includes(date.getDay());
  };

  const handleDateChange = (date) => {
    date = format(date, "dd-MM-yyyy");
    setSelectedDate(date);
  };

  const handleSelectedTimesChange = (label, isChecked) => {
    setSelectedTimes((prev) => {
      if (isChecked) return [...prev, label];
      else return prev.filter((item) => item !== label);
    });
  };

  const onSubmit = (dataForm) => {
    const payload = {
      ...dataForm,
      date: format(dataForm.date, "yyyy-MM-dd"),
      court: selectedCourt
    };
    console.log(payload);
  };
  return (
    <div className="scheduling-simple">
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ComboBoxItem
          control={control}
          name="court"
          options={["quadra1", "quadra2"]} //aqui vai ter um map() para passar de um array de obj para um array de str com o nome da quadra
          onChange={setSelectedCourt}
          label="Selecione a quadra"
          placeholder="Selecione"
          values={[1, 2]}
        />
        <InputItem
          control={control}
          name={"name"}
          label={"Nome do time"}
          placeholder={"nome"}
        />
        <Controller
          control={control}
          name="date"
          defaultValue={null}
          render={({ field }) => (
            <DatePicker
              inline
              selected={field.value}
              onChange={(date) => {
                field.onChange(date);
                handleDateChange(date);
              }}
              dateFormat="dd/MM/yyyy"
              minDate={minDate}
              maxDate={maxDate}
              //excludeDates={disabledDates}
              //filterDate={handleFilterWeekDays}
            />
          )}
        />
        {/* {avaliableTimes ? (
          <>
            <p className="scheduling-simple-form-text">
              Selecione um ou mais horarios que deseja agendar
            </p>
            {avaliableTimes.map((time, index) => {
              return (
                <CheckBoxItem
                  control={control}
                  label={time}
                  name="times"
                  id={index}
                  onChange={handleSelectedTimesChange}
                  key={index}
                />
              );
            })}
          </>
        ) : (
          <></>
        )} */}
        <FormButton label="Enviar" />
      </form>
    </div>
  );
};

export default CreateAppointment;
