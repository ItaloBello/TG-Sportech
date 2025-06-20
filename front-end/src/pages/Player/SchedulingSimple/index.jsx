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
import { useNavigate } from "react-router-dom";

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
    handleCreateAppointment,
  } = usePlayerAuth();

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const moreDays = 30;
  const minDate = new Date(Date.now());
  const maxDate = new Date(Date.now() + moreDays * 24 * 60 * 60 * 1000);

  const navigate = useNavigate();

  useLayoutEffect(() => {
    const getCourts = async () => {
      await handleGetCourt();
    };
    getCourts();
    if (!courts) {
      alert(
        "Não há quadras cadastradas ainda, não é possivel agendar no momento"
      );
      navigate("/player/menu");
    }
  }, [player.id]);

  useEffect(() => {
    if (selectedCourt) {
      const getWeekDaysToFilter = async () => {
        await handleGetWeekDaysToFilter(selectedCourt);
      };
      getWeekDaysToFilter();

      const getDisabledDates = async () => {
        const payload = {
          minDate: format(minDate, "yyyy-MM-dd"),
          maxDate: format(maxDate, "yyyy-MM-dd"),
        };

        await handleGetDisabledDates(
          selectedCourt,
          payload.minDate,
          payload.maxDate
        );
      };
      getDisabledDates();
    } else console.log("nao mudou o court");
  }, [selectedCourt]);

  useEffect(() => {
    if (selectedCourt && selectedDate) {
      const getAvaliableTimes = async () => {
        console.log("Buscando horários disponíveis para:", { quadra: selectedCourt, data: selectedDate });
        await handleGetAvaliableTimes(selectedCourt, selectedDate);
        console.log("Horários disponíveis:", avaliableTimes);
      };
      getAvaliableTimes();
    }
  }, [selectedCourt, selectedDate]);

  const handleFilterWeekDays = (date) => {
    return !weekDaysToFilter.includes(date.getDay());
  };

  const handleDateChange = (date) => {
    // Corrigido para enviar data no formato ISO aceito pelo backend
    const formatted = format(date, "yyyy-MM-dd");
    console.log("Data formatada:", formatted);
    setSelectedDate(formatted);
  }

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
      date: format(dataForm.date, "yyyy-MM-dd"), // mantém formato ISO para o backend
      times: selectedTimes,
      court: selectedCourt,
      idJogador: player.id,
    };

    console.log("player", player);
    console.log("enviando");
    console.log(payload);
    handleCreateAppointment(payload);
  };

  return (
    <div className="scheduling-simple">
      <Header link={1}/>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ComboBoxItem
          control={control}
          name="court"
          options={courts.map((court) => court.name)} //aqui vai ter um map() para passar de um array de obj para um array de str com o nome da quadra
          onChange={setSelectedCourt}
          label="Selecione a quadra"
          placeholder="Selecione"
          values={courts.map((court) => court.id)}
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
                  key={index}
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
