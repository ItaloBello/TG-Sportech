import React from 'react'
import MatchCard from '../../../components/MatchCard'

const MyMatches = () => {
  return (
    <div className='my-matches'>
      <p className='my-matches__title'>Partidas Finalizadas</p>
      <div className="cards-area">
        <MatchCard date={'1/1/1000'} teams={['japioca', 'japioca']} title={'oitavas'} points={[2,4]}/>
        <MatchCard date={'1/1/1000'} teams={['japioca', 'tridentina']} title={'oitavas'} points={[2,4]}/>
      </div>
      <p className='my-matches__title'>Proximas Partidas</p>
      <div className="cards-area">
        <MatchCard date={'1/1/1000'} teams={['japioca', 'japioca']} title={'oitavas'} points={[2,4]}/>
        <MatchCard date={'1/1/1000'} teams={['japioca', 'tridentina']} title={'oitavas'} points={[2,4]}/>
      </div>
    </div>
  )
}

export default MyMatches