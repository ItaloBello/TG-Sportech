import React, { useState } from "react";
import Header from "../../../components/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormButton from "../../../components/FormButton";
import { format } from "date-fns";
import "./styles.css";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    date: yup.date(),
  })
  .required();

const SchedulingSimple = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const moreDays = 4;
  const minDate = new Date(Date.now());
  const maxDate = new Date(Date.now() + moreDays * 24 * 60 * 60 * 1000);

  

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
        date: format(dataForm.date, 'dd-MM-yyyy')
    }
    console.log(dataForm);
    
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    //TODO quando integrar com o back, coloca a requisição de pesquisar os horarios aqui
  };

  return (
    <div className="scheduling-simple">
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="date"
          defaultValue={null}
          render={({ field }) => (
            <DatePicker
              inline
              selected={field.value}
              onChange={field.onChange}
              dateFormat="dd/MM/yyyy; hh:mm"
              minDate={minDate}
              maxDate={maxDate}
              onInputClick={console.log('oi')}
              showTimeSelect
              timeIntervals={60}
              timeFormat="hh:mm"
            />
          )}
        />

        <FormButton label="enviar" />
      </form>
    </div>
  );
};

export default SchedulingSimple;
