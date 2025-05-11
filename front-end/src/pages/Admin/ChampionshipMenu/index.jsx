import React from 'react'
import Header from '../../../components/Header'
import MenuItem from '../../../components/MenuItem'

const ChampionshipMenu = () => {
  return (
    <div className='championship-menu'>
        <Header/>
        <MenuItem label='Campeonatos em Andamento' link=''/>
        <MenuItem label='Campeonatos não Iniciados'/>
        <MenuItem label='Criar Campeonato' link='/admin/create-championship/menu'/>
        <MenuItem
        src="../../public/arrow-icon.png"
        alt="icone de voltar"
        link="/admin/menu"
        label="Voltar"
        color="#EC221F"
      />
    </div>
  )
}

export default ChampionshipMenu