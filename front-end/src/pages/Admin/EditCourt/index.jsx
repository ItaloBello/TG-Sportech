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
    name: yup.string().required("Nome da quadra é obrigatório"),
    typeCourt: yup.string().required("Tipo da quadra é obrigatório"),
    timeDivision: yup.string().required("Divisão de tempo é obrigatória"),
    percent: yup.number().required("Percentual do sinal é obrigatório").typeError("Percentual deve ser um número").min(0, "Percentual não pode ser negativo").max(100, "Percentual não pode ser maior que 100"),

    sunday: yup.boolean(),
    sundayHour: yup.number().when('sunday', {
      is: true,
      then: schema => schema.required("Valor/hora é obrigatório para Domingo").typeError("Valor/hora deve ser um número"),
      otherwise: schema => schema.nullable().transform(v => (isNaN(v) ? null : Number(v))),
    }),
    sundayInitial: yup.string().when('sunday', {
      is: true,
      then: schema => schema.required("Horário inicial é obrigatório para Domingo"),
      otherwise: schema => schema.optional(),
    }),
    sundayEnd: yup.string().when('sunday', {
      is: true,
      then: schema => schema.required("Horário final é obrigatório para Domingo"),
      otherwise: schema => schema.optional(),
    }),

    monday: yup.boolean(),
    mondayHour: yup.number().when('monday', {
      is: true,
      then: schema => schema.required("Valor/hora é obrigatório para Segunda").typeError("Valor/hora deve ser um número"),
      otherwise: schema => schema.nullable().transform(v => (isNaN(v) ? null : Number(v))),
    }),
    mondayInitial: yup.string().when('monday', {
      is: true,
      then: schema => schema.required("Horário inicial é obrigatório para Segunda"),
      otherwise: schema => schema.optional(),
    }),
    mondayEnd: yup.string().when('monday', {
      is: true,
      then: schema => schema.required("Horário final é obrigatório para Segunda"),
      otherwise: schema => schema.optional(),
    }),

    tuesday: yup.boolean(),
    tuesdayHour: yup.number().when('tuesday', {
      is: true,
      then: schema => schema.required("Valor/hora é obrigatório para Terça").typeError("Valor/hora deve ser um número"),
      otherwise: schema => schema.nullable().transform(v => (isNaN(v) ? null : Number(v))),
    }),
    tuesdayInitial: yup.string().when('tuesday', {
      is: true,
      then: schema => schema.required("Horário inicial é obrigatório para Terça"),
      otherwise: schema => schema.optional(),
    }),
    tuesdayEnd: yup.string().when('tuesday', {
      is: true,
      then: schema => schema.required("Horário final é obrigatório para Terça"),
      otherwise: schema => schema.optional(),
    }),

    wednesday: yup.boolean(),
    wednesdayHour: yup.number().when('wednesday', {
      is: true,
      then: schema => schema.required("Valor/hora é obrigatório para Quarta").typeError("Valor/hora deve ser um número"),
      otherwise: schema => schema.nullable().transform(v => (isNaN(v) ? null : Number(v))),
    }),
    wednesdayInitial: yup.string().when('wednesday', {
      is: true,
      then: schema => schema.required("Horário inicial é obrigatório para Quarta"),
      otherwise: schema => schema.optional(),
    }),
    wednesdayEnd: yup.string().when('wednesday', {
      is: true,
      then: schema => schema.required("Horário final é obrigatório para Quarta"),
      otherwise: schema => schema.optional(),
    }),

    thursday: yup.boolean(),
    thursdayHour: yup.number().when('thursday', {
      is: true,
      then: schema => schema.required("Valor/hora é obrigatório para Quinta").typeError("Valor/hora deve ser um número"),
      otherwise: schema => schema.nullable().transform(v => (isNaN(v) ? null : Number(v))),
    }),
    thursdayInitial: yup.string().when('thursday', {
      is: true,
      then: schema => schema.required("Horário inicial é obrigatório para Quinta"),
      otherwise: schema => schema.optional(),
    }),
    thursdayEnd: yup.string().when('thursday', {
      is: true,
      then: schema => schema.required("Horário final é obrigatório para Quinta"),
      otherwise: schema => schema.optional(),
    }),

    friday: yup.boolean(),
    fridayHour: yup.number().when('friday', {
      is: true,
      then: schema => schema.required("Valor/hora é obrigatório para Sexta").typeError("Valor/hora deve ser um número"),
      otherwise: schema => schema.nullable().transform(v => (isNaN(v) ? null : Number(v))),
    }),
    fridayInitial: yup.string().when('friday', {
      is: true,
      then: schema => schema.required("Horário inicial é obrigatório para Sexta"),
      otherwise: schema => schema.optional(),
    }),
    fridayEnd: yup.string().when('friday', {
      is: true,
      then: schema => schema.required("Horário final é obrigatório para Sexta"),
      otherwise: schema => schema.optional(),
    }),

    saturday: yup.boolean(),
    saturdayHour: yup.number().when('saturday', {
      is: true,
      then: schema => schema.required("Valor/hora é obrigatório para Sábado").typeError("Valor/hora deve ser um número"),
      otherwise: schema => schema.nullable().transform(v => (isNaN(v) ? null : Number(v))),
    }),
    saturdayInitial: yup.string().when('saturday', {
      is: true,
      then: schema => schema.required("Horário inicial é obrigatório para Sábado"),
      otherwise: schema => schema.optional(),
    }),
    saturdayEnd: yup.string().when('saturday', {
      is: true,
      then: schema => schema.required("Horário final é obrigatório para Sábado"),
      otherwise: schema => schema.optional(),
    }),
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


  const [selectedDays, setSelectedDays] = useState([]);

  // Buscar quadra ao montar ou quando selectedCourt (ID) muda
  useEffect(() => {
    if (selectedCourt) { // Only call if selectedCourt (ID) exists
      handleGetCourt(selectedCourt);
    }
  }, [selectedCourt, handleGetCourt]); // Rerun if selectedCourt or handleGetCourt changes

  // Popular formulário quando os dados da quadra chegarem
  useEffect(() => {
    if (court && court.quadra) {
      console.log('Fetched court data for edit page:', court);
      setValue("name", court.quadra.nome || "");
      setValue("typeCourt", court.quadra.tipo || "");
      setValue("timeDivision", court.quadra.meioSlot ? "30 Minutos" : "1 hora");
      setValue("percent", (court.quadra.porcSinal || 0) * 100);


      const activeDaysForState = [];
      // Maps backend diaSemana string to form field prefixes
      const dayStringToPrefixMap = {
        'domingo': "sunday",
        'segunda': "monday",
        'terca': "tuesday", // Adjusted to 'terca' - please verify backend string
        'quarta': "wednesday",
        'quinta': "thursday",
        'sexta': "friday",
        'sabado': "saturday", // Adjusted to 'sabado' - please verify backend string
      };

      // Maps backend diaSemana string to CheckBoxItem labels (must match exactly)
      const dayStringToLabelMap = {
        'domingo': "Domingo",
        'segunda': "Segunda",
        'terca': "Terça",    // Adjusted to 'terca' - please verify backend string
        'quarta': "Quarta",
        'quinta': "Quinta",
        'sexta': "Sexta",
        'sabado': "Sabado",  // Adjusted to 'sabado' - please verify backend string
      };

      if (court.horarios && Array.isArray(court.horarios)) {
        // Initialize all day checkboxes to false and clear time/hour fields first
        Object.values(dayStringToPrefixMap).forEach(prefix => {
          setValue(prefix, false);
          setValue(`${prefix}Initial`, "");
          setValue(`${prefix}End`, "");
          setValue(`${prefix}Hour`, "");
        });

        court.horarios.forEach(horario => {
          // Normalize backend diaSemana to lowercase for consistent mapping
          const diaSemanaNormalized = horario.diaSemana.toLowerCase(); 
          const dayPrefix = dayStringToPrefixMap[diaSemanaNormalized];
          
          if (dayPrefix) {
            setValue(dayPrefix, true); // Check the box for the day
            setValue(`${dayPrefix}Initial`, horario.horaInicio ? horario.horaInicio.substring(0, 5) : "");
            setValue(`${dayPrefix}End`, horario.horaFim ? horario.horaFim.substring(0, 5) : "");
            setValue(`${dayPrefix}Hour`, horario.valorHora ? parseFloat(horario.valorHora) : "");
            
            const label = dayStringToLabelMap[diaSemanaNormalized];
            if (label) {
              activeDaysForState.push(label);
            }
          }
        });
      }
      setSelectedDays(activeDaysForState);
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
      ...formData, // typeCourt is now part of formData
      weekDays: selectedDays, // This still needs to be transformed for the backend
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
          placeholder={court && court.quadra ? court.quadra.nome : "Carregando..."}
        />
        <ComboBoxItem
          control={control}
          errorMessage={errors?.typeCourt?.message}
          name="typeCourt"
          label="tipo da quadra"
          placeholder="selecione o tipo da quadra"
          options={["society", "gramado"]}
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
