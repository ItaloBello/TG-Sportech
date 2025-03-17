import React from 'react'
import Header from '../../components/Header'
import InputList from '../../components/InputList'
import ButtonList from '../../components/ButtonList'
import "./styles.css"
const JoinTeam = () => {
  return (
    <div className='join-team'>
        <Header/>
        <p className='join-team__text'>Insira o invite code do time que deseja entrar no campo abaixo.</p>
        <InputList items={1} labels={["Invite Code"]} placeholders={["Code"]}/>
        <ButtonList items={1} labels={["Entrar"]} links={[]} colors={["#14ae5c"]}/>
    </div>
  )
}

export default JoinTeam