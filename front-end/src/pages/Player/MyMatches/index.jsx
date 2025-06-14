import React, { useEffect, useState } from 'react'
import MatchCard from '../../../components/MatchCard'
import Header from '../../../components/Header'
import { api } from '../../../services/api'

const championshipId = localStorage.getItem('championshipId') || 1 // ajuste conforme seu fluxo
const quadraId = 1 // ajuste conforme seu banco

const MyMatches = () => {
  const [finalizadas, setFinalizadas] = useState([])
  const [proximas, setProximas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMatches = () => {
    setLoading(true)
    api.get(`/api/campeonato/${championshipId}/partidas`).then(res => {
      const partidas = res.data
      setFinalizadas(partidas.filter(p => p.status === 'finalizado'))
      setProximas(partidas.filter(p => p.status !== 'finalizado'))
      setLoading(false)
    }).catch(() => {
      setError('Erro ao buscar partidas')
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  // Função para gerar próxima fase
  const gerarChaveamento = async (fase) => {
    try {
      await api.post(`/api/campeonato/${championshipId}/gerar-chaveamento`, {
        fase,
        quadraId,
        data: new Date().toISOString().slice(0,10),
        hora: '12:00:00'
      })
      fetchMatches()
      alert(`Chaveamento para fase ${fase} gerado!`)
    } catch (e) {
      alert('Erro ao gerar chaveamento: ' + (e.response?.data?.error || e.message))
    }
  }

  return (
    <div className='my-matches'>
      <Header link={1}/>
      <p className='my-matches__title'>Partidas Finalizadas</p>
      <div className="cards-area">
        {loading && <p>Carregando...</p>}
        {error && <p style={{color:'red'}}>{error}</p>}
        {finalizadas.map(p => (
          <MatchCard
            key={p.id}
            date={p.data}
            teams={[p.timeA?.name, p.timeB?.name]}
            title={p.fase}
            points={[p.golsTimeA, p.golsTimeB]}
          />
        ))}
      </div>
      <p className='my-matches__title'>Próximas Partidas</p>
      <div className="cards-area">
        {proximas.map(p => (
          <MatchCard
            key={p.id}
            date={p.data}
            teams={[p.timeA?.name, p.timeB?.name]}
            title={p.fase}
            points={[p.golsTimeA, p.golsTimeB]}
          />
        ))}
      </div>
      <div style={{marginTop: '2rem'}}>
        <button onClick={() => gerarChaveamento('quartas')}>Gerar Quartas de Final</button>{' '}
        <button onClick={() => gerarChaveamento('semi')}>Gerar Semifinal</button>{' '}
        <button onClick={() => gerarChaveamento('final')}>Gerar Final</button>
      </div>
    </div>
  )
}

export default MyMatches