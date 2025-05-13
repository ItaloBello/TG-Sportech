import React from 'react'
import MenuItem from '../../../components/MenuItem'
import Header from '../../../components/Header'

const CreateChampionshipMenu = () => {
  return (
    <div className='create-championship-menu'>
        <Header/>
        <h2>Escolha o tipo de campeonato a ser criado</h2>
        <MenuItem label='Playoffs' link='/admin/create-championship/playoffs'/>
        <MenuItem label='Pontos Corridos' link='/admin/create-championship/points'/>
    </div>
  )
}

export default CreateChampionshipMenu