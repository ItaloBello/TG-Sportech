import React from 'react'
import Header from '../../../components/Header'
import MenuItem from '../../../components/MenuItem'

const AdminMenu = () => {
  return (
    <div className='admin-menu'>
        <Header/>
        <MenuItem label='Quadras' link='/admin/court-menu'/>
        <MenuItem label='Campeonatos' link='/admin/championship-menu'/>
        <MenuItem label='Agendamentos'/>
        <div className="admin-menu__log-out-button">
        <button>
          <img src="../../public/log-out-icon.png" alt="icone de log out" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  )
}

export default AdminMenu