import React from 'react'
import MatchCard from '../../../components/MatchCard'
import Header from '../../../components/Header'

const MyMatches = () => {
  return (
    <div className='my-matches'>
      <Header link={1}/>
      <p className='my-matches__title'>Partidas Finalizadas</p>
      <div className="cards-area">
        <MatchCard date={'1/1/1000'} teams={['São Bernardo', 'Inter-regional']} title={'oitavas'} points={[2,4]}/>
        <MatchCard date={'1/1/1000'} teams={['São Bento FC', 'Inter-regional']} title={'oitavas'} points={[2,4]}/>
      </div>
      <p className='my-matches__title'>Proximas Partidas</p>
      <div className="cards-area">
        <MatchCard date={'1/1/1000'} teams={['São Bento FC', 'Inter-regional']} title={'oitavas'} points={[2,4]}/>
        <MatchCard date={'1/1/1000'} teams={['São Bento FC', 'Grêmio Fatecano']} title={'oitavas'} points={[2,4]}/>
      </div>
    </div>
  )
}

export default MyMatches