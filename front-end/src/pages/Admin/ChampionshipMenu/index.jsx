import React from 'react'
import Header from '../../../components/Header'
import MenuItem from '../../../components/MenuItem'

//OK

const ChampionshipMenu = () => {
  return (
    <div className='championship-menu'>
        <Header/>
        <MenuItem label='Campeonatos em Andamento' link='/admin/select-championship/in-progress'/>
        <MenuItem label='Campeonatos não Iniciados' link='/admin/select-championship/not-started'/>
        <MenuItem label='Criar Campeonato' link='/admin/create-championship/playoffs'/>
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