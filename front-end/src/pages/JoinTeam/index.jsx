import React from 'react'
import Header from '../../components/Header'
import "./styles.css"
import ButtonItem from '../../components/ButtonItem'
import InputItem from '../../components/InputItem'
const JoinTeam = () => {
  return (
    <div className='join-team'>
        <Header/>
        <p className='join-team__text'>Insira o invite code do time que deseja entrar no campo abaixo.</p>
        <InputItem label="Invite Code" placeholder="Code"/>
        <ButtonItem color="#14ae5c" label="Entrar" link=""/>
    </div>
  )
}

export default JoinTeam