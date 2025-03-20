import React from 'react'
import "./styles.css"
import InputItem from '../../components/InputItem'
import ButtonItem from '../../components/ButtonItem'

const PlayerProfile = () => {
  return (
    <div className='player-profile'>
        <img className="player-profile__image" src="../../public/profile-placeholder-icon.png" alt="placeholdr da foto de perfil" />
        <InputItem label="Usuario" placeholder="Usuario"/>
        <InputItem label="Email" placeholder="Email"/>
        <InputItem label="Celular" placeholder="Celular"/>
        <InputItem label="CPF" placeholder="CPF"/>
        <ButtonItem color="#14ae5c" label="Sair e Salvar" link="/player/menu"/>

    </div>
  )
}

export default PlayerProfile