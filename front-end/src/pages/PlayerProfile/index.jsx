import React from 'react'
import InputList from '../../components/InputList'
import ButtonList from '../../components/ButtonList'
import "./styles.css"
const PlayerProfile = () => {
  return (
    <div className='player-profile'>
        <img className="player-profile__image" src="../../public/profile-placeholder-icon.png" alt="placeholdr da foto de perfil" />
        <InputList items={4} labels={["Usuario", "Email", "Celular", "CPF"]} placeholders={["Usuario", "Email", "Celular", "CPF"]}/>
        <ButtonList items={1} labels={["Sair e Salvar"]} links={["/player/menu"]} colors={["#14ae5c"]}/>
    </div>
  )
}

export default PlayerProfile