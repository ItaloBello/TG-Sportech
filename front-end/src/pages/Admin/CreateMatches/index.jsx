import React, { useEffect, useState } from "react";
import MatchCardToCreate from "../../../components/MatchCardToCreate";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "../../../components/Header";
import { useAdminAuth } from "../../../hooks/useAdminAuth";
const schema = yup
  .object({
    name: yup.string().required(),
    gamesPerDay: yup.number().required(),
    gamesInterval: yup.number().required(),
    initialDate: yup.date().required(),
    teamsNumber: yup.number(),
    description: yup.string(),
    registration: yup.number(),
    premiation: yup.number(),
  })
  .required();

const CreateMatches = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const { admin, teamNumber, handleGetTeamNumber } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getTeamNumber = async () => {
      try {
        await handleGetTeamNumber(champ.id);
      } finally {
        setIsLoading(false);
      }
    };
    getTeamNumber();
  }, [admin.id]);

  if (isLoading) return <></>;

  return (
    <div className="create-matches">
      <Header />
      <form>
        {teamNumber >= 16 ? (
          <>
            <MatchCardToCreate
              control={control}
              nameDate={"dateOct0"}
              nameTime={"timeOct0"}
              title={"oitavas"}
            />
            <MatchCardToCreate
              control={control}
              nameDate={"dateOct1"}
              nameTime={"timeOct1"}
              title={"oitavas"}
            />
            <MatchCardToCreate
              control={control}
              nameDate={"dateOct2"}
              nameTime={"timeOct2"}
              title={"oitavas"}
            />
            <MatchCardToCreate
              control={control}
              nameDate={"dateOct3"}
              nameTime={"timeOct3"}
              title={"oitavas"}
            />
            <MatchCardToCreate
              control={control}
              nameDate={"dateOct4"}
              nameTime={"timeOct4"}
              title={"oitavas"}
            />
            <MatchCardToCreate
              control={control}
              nameDate={"dateOct5"}
              nameTime={"timeOct5"}
              title={"oitavas"}
            />
            <MatchCardToCreate
              control={control}
              nameDate={"dateOct6"}
              nameTime={"timeOct6"}
              title={"oitavas"}
            />
            <MatchCardToCreate
              control={control}
              nameDate={"dateOct7"}
              nameTime={"timeOct7"}
              title={"oitavas"}
            />
          </>
        ) : (
          <></>
        )}
        {teamNumber >= 8 ? (
          <>
            <MatchCardToCreate
              control={control}
              nameDate={"dateQua0"}
              nameTime={"timeQua0"}
              title={"oitavas"}
            />
            <MatchCardToCreate
              control={control}
              nameDate={"dateQua1"}
              nameTime={"timeQua1"}
              title={"oitavas"}
            />
            <MatchCardToCreate
              control={control}
              nameDate={"dateQua2"}
              nameTime={"timeQua2"}
              title={"oitavas"}
            />
            <MatchCardToCreate
              control={control}
              nameDate={"dateQua3"}
              nameTime={"timeQua3"}
              title={"oitavas"}
            />
          </>
        ) : (
          <></>
        )}
        <MatchCardToCreate
          control={control}
          nameDate={"dateSemi0"}
          nameTime={"timeSemi0"}
          title={"oitavas"}
        />
        <MatchCardToCreate
          control={control}
          nameDate={"dateSemi1"}
          nameTime={"timeSemi1"}
          title={"oitavas"}
        />
        <MatchCardToCreate
          control={control}
          nameDate={"dateFinal"}
          nameTime={"timeFinal"}
          title={"oitavas"}
        />
      </form>
    </div>
  );
};

export default CreateMatches;
