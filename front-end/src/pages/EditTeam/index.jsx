import React from 'react'
import "./styles.css"
import InputItem from '../../components/InputItem'
import ButtonItem from '../../components/ButtonItem'
const EditTeam = () => {
  return (
    <div className='edit-team'>
        <div className="edit-team__header">
            <p>Editar Time</p>
            <img src="../../../public/add-img-team.png" alt="adicione a imagem time"/>
        </div>
        <InputItem label="Nome do Time" placeholder="Time"/>
        <InputItem label="Cor Primaria" placeholder="Cor"/>
        <InputItem label="Cor Secundaria" placeholder="Cor"/>
        <div className="edit-team__button-area">
            <ButtonItem label="Cancelar" link="/player/showteam" color="#EC221F"/>
            <ButtonItem label="Salvar" link="/player/showteam"/>
        </div>
        {/* TODO: Criar a tabela de jogadores dentro do time, mostrar o capitao, colocar um botao de X para remover alguem do time */}
    </div>
  )
}

export default EditTeam