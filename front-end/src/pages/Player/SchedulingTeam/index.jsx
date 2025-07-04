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
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    date: yup.date(),
    court: yup.string(),
  })
  .required();

const SchedulingTeam = () => {
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
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [selectedMyTeam, setSelectedMyTeam] = useState(null);
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
      date: format(dataForm.date, "yyyy-MM-dd"),
      times: selectedTimes,
      court: selectedCourt,
      myTeam:selectedMyTeam,
      opponent: selectedOpponent,
      playerId: player.id,
    };
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
          name="myTeam"
          onChange={setSelectedMyTeam}
          label="Selecione seu time"
          placeholder="Selecione"
          options={['time1', 'time2']}
          values={[1,2]}
        />
        <ComboBoxItem
          control={control}
          name="opponent"
          onChange={setSelectedOpponent}
          label="Selecione seu adversario"
          placeholder="Selecione"
          options={['time3', 'time4']}
          values={[3,4]}
        />
        <ComboBoxItem
          control={control}
          name="court"
          options={Array(courts.length)
            .fill("")
            .map((value, index) => (value = courts[index].name))}
          onChange={setSelectedCourt}
          label="Selecione a quadra"
          placeholder="Selecione"
          values={Array(courts.length)
            .fill("")
            .map((value, index) => (value = courts[index].id))}
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
        <FormButton label="Enviar" />
      </form>
    </div>
  );
};

export default SchedulingTeam;
