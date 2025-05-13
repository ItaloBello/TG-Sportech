import React from 'react'
import Header from '../../../components/Header'
import MenuItem from '../../../components/MenuItem'

const SchedulingMenu = () => {
  return (
    <div className='scheduling-menu'>
        <Header/>
        <MenuItem label='Agendar Rachão' link='/player/scheduling-simple'/>
        <MenuItem label='Agendar Amistoso'/>
        <MenuItem label='Meus Agendamentos'/>
        <MenuItem
        src="../../public/arrow-icon.png"
        alt="icone de voltar"
        link="/player/menu"
        label="Voltar"
        color="#EC221F"
      />
    </div>
  )
}

export default SchedulingMenu