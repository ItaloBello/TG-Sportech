import React, { useEffect, useState } from "react";
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
  const { player } = usePlayerAuth();

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([])

  const [weekDaysToFilter, setWeekDaysToFilter] = useState([0, 2, 5]); //0 = domingo, 2= terça, 5=sexta
  const [disabledDatesRange, setDisabledDatesRange] = useState([  
    { start: new Date("2025-05-22"), end: new Date("2025-05-24") },
    { start: new Date("2025-05-12"), end: new Date("2025-05-14") },
  ])
  const [avaliableTimes, setAvaliableTimes] = useState(['18:00-19:00','19:00-20:00','20:00-21:00'])

  const moreDays = 14;
  const minDate = new Date(Date.now());
  const maxDate = new Date(Date.now() + moreDays * 24 * 60 * 60 * 1000);

  useEffect(() => {
    //TODO requisição para pegar todas as quadras, retornar pelo menos o id e o nome
  }, [player.id]);

  useEffect(() => {
    
    if (selectedCourt) {
      //TODO requisição para receber os dias da semana a serem bloqueados, sem horario, !!!!verificar se é necessario!!!!
      setWeekDaysToFilter([1,3])

      //TODO requisição para retornar os dias sem agendamento disponível, ela deve retornar um arra com um ojb {start: Date, end: Date}
      setDisabledDatesRange([{start:new Date('2025-05-15'), end: new Date('2025-05-17')}])

      //TODO requisição para pegar os horarios de uma quadra determinada
      setAvaliableTimes(['14:00-15:00','15:00-16:00', '16:00-17:00', '17:00-18:00'])
    } else console.log("nao mudou o court");
  }, [selectedCourt]);

  const handleFilterWeekDays = (date) => {
    return !weekDaysToFilter.includes(date.getDay());
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

  const handleSelectedTimesChange = (label, isChecked) => {
    setSelectedTimes((prev) => {
      if (isChecked) return [...prev, label];
      else return prev.filter((item) => item !== label);
    });
  };

  return (
    <div className="scheduling-simple">
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ComboBoxItem
          control={control}
          name="court"
          options={["quadra 1", "quadra 2"]} //aqui vai ter um map() para passar de um array de obj para um array de str
          onChange={setSelectedCourt}
          label="Selecione a quadra"
          placeholder="Selecione"
        />
        <Controller
          control={control}
          name="date"
          defaultValue={null}
          render={({ field }) => (
            <DatePicker
              inline
              selected={field.value}
              onChange={field.onChange}
              dateFormat="dd/MM/yyyy"
              minDate={minDate}
              maxDate={maxDate}
              excludeDateIntervals={disabledDatesRange}
              filterDate={handleFilterWeekDays}
              
            />
          )}
        />
        {avaliableTimes?
        <>
          <p className="scheduling-simple-form-text">Selecione um ou mais horarios que deseja agendar</p>
          {avaliableTimes.map((time, index)=>{
            return(
              <CheckBoxItem control={control} label={time} name='times' id={index} onChange={handleSelectedTimesChange}/>
            )
          })}
        </>:<></>}
        <FormButton label="enviar" />
      </form>
    </div>
  );
};

export default SchedulingSimple;
