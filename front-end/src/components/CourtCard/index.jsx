import React from 'react'
import './styles.css'
import { Link } from 'react-router-dom'

const CourtCard = (
    {name}
) => {
  return (
    <div className='court-card'>
        <span>{name}</span>
        <Link to='/admin/select-court/edit'>Editar</Link>
    </div>
  )
}

export default CourtCard