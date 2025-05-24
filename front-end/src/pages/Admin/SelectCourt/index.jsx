import React from 'react'
import './styles.css'
import Header from '../../../components/Header'
import CourtCard from '../../../components/CourtCard'

const SelectCourt = () => {
  return (
    <div className='select-court'>
        <Header/>

        <div className="select-court__main">
            <CourtCard name='quadra cabecinha'/>
            <CourtCard name='quadra jubileu'/>
        </div>
    </div>
  )
}

export default SelectCourt