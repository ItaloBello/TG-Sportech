import React from 'react'
import logoSportech from '../assets/images/sportech-logo.png'
import "./styles.css"
const Header = () => {
  return (
    <div className='header'>
        <img src={logoSportech} alt="logo" className='header__img' />
    </div>
  )
}

export default Header