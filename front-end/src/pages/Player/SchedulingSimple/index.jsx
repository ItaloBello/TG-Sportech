import React, { useEffect, useLayoutEffect, useState } from "react";
import Header from "../../../components/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormButton from "../../../components/FormButton";
import { format } from "date-fns";
import "./styles.css";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ComboBoxItem from "../../../components/ComboBoxItem";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import CheckBoxItem from "../../../components/checkBoxItem";

const schema = yup
  .object({
    date: yup.date(),
    court: yup.string(),
  })
  .required();

const SchedulingSimple = () => {
  const {
    player,
    courts,
    weekDaysToFilter,
    disabledDates,
    avaliableTimes,
    handleGetCourt,
    handleGetWeekDaysToFilter,
    handleGetDisabledDates,
    handleGetAvaliableTimes,
  } = usePlayerAuth();

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const moreDays = 30;
  const minDate = new Date(Date.now());
  const maxDate = new Date(Date.now() + moreDays * 24 * 60 * 60 * 1000);

  useLayoutEffect(() => {
    const getCourts = async () => {
      await handleGetCourt();
    };
    getCourts();
    console.log(courts);
  }, [player.id]);

  useEffect(() => {
    if (selectedCourt) {
      const getWeekDaysToFilter = async () => {
        await handleGetWeekDaysToFilter(selectedCourt);
      };
      getWeekDaysToFilter();

      const getDisabledDates = async () => {
        await handleGetDisabledDates(selectedCourt);
      };
      getDisabledDates();
    } else console.log("nao mudou o court");
  }, [selectedCourt]);

  useEffect(() => {
    if (selectedCourt && selectedDate) {
      //TODO requisição para pegar os horarios de uma quadra determinada
      const getAvaliableTimes = async () => {
        await handleGetAvaliableTimes(selectedCourt, selectedDate);
      };
      getAvaliableTimes();
    }
  }, [selectedCourt, selectedDate]);

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

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const onSubmit = (dataForm) => {
    const payload = {
      ...dataForm,
      date: format(dataForm.date, "dd-MM-yyyy"),
      times: selectedTimes,
      court: selectedCourt,
    };
    console.log("enviando");
    console.log(payload);
  };
  return (
    <div className="scheduling-simple">
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ComboBoxItem
          control={control}
          name="court"
          options={Array(courts.length)
            .fill("")
            .map((value, index) => (value = courts[index].name))} //aqui vai ter um map() para passar de um array de obj para um array de str com o nome da quadra
          onChange={setSelectedCourt}
          label="Selecione a quadra"
          placeholder="Selecione"
          values={Array(courts.length)
            .fill("")
            .map((value, index) => (value = courts[index].id))} //aqui vai ter um map() para passar de um array de obj para um array de str com o id da quadra
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
              excludeDates={disabledDates}
              filterDate={handleFilterWeekDays}
            />
          )}
        />
        {avaliableTimes ? (
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
                />
              );
            })}
          </>
        ) : (
          <></>
        )}
        <FormButton label="enviar" />
      </form>
    </div>
  );
};

export default SchedulingSimple;
