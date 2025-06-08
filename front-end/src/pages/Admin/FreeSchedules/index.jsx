import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import ComboBoxItem from "../../../components/ComboBoxItem";
import InputItem from "../../../components/InputItem";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAdminAuth } from "../../../hooks/useAdminAuth";
import FormButton from "../../../components/FormButton";

const schema = yup
  .object({
    court: yup.string(),
    date: yup.string(),
  })
  .required();
const FreeSchedules = () => {
  const { admin, handleGetMyCourts, myCourts, handleGetAvaliableTimes } = useAdminAuth();
  const [selectedCourt, setSelectedCourt] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [myCourtsName, setMyCourtsName] = useState([]);
  const [myCourtsId, setMyCourtsId] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    const getCourts = async () => {
      try {
        await handleGetMyCourts(admin.id);
        setMyCourtsName(
          Array(myCourts.length)
            .fill("")
            .map((court, index) => myCourts[index].name)
        );
        setMyCourtsId(
          Array(myCourts.length)
            .fill("")
            .map((court, index) => myCourts[index].id)
        );
      } finally {
        setIsLoading(false);
      }
    };
    getCourts();
  }, [admin.id, myCourts.length]);

  const onSubmit = (dataForm) => {
    const payload = {
      ...dataForm,
      court: selectedCourt,
    };
    console.log(payload);

    // handleGetAvaliableTimes(payload.court,payload.date)
  };

  if (isLoading) return <></>;

  return (
    <div className="free-schedules">
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ComboBoxItem
          control={control}
          name="court"
          label="selecione a quadra"
          options={myCourtsName}
          onChange={setSelectedCourt}
          values={myCourtsId} 
        />
        <InputItem
          control={control}
          name="date"
          type="date"
          label="selcione o dia"
        />
        <FormButton label="pesquisar"/>
      </form>
    
    </div>
  );
};

export default FreeSchedules;
