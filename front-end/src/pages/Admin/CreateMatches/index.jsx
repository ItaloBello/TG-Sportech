import React from 'react'
import MatchCardToCreate from '../../../components/MatchCardToCreate'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from '../../../components/Header';

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
  return (
    <div className='create-matches'>
        <Header/>
        <MatchCardToCreate control={control} nameDate={'date0'} nameTime={'time0'} title={'oitavas'} />
    </div>
  )
}

export default CreateMatches