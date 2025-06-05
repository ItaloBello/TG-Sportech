import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { notifySuccess, notifyError } from '../../../utils/notify';
import './styles.css';

export default function ChampionshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [championship, setChampionship] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [activeTab, setActiveTab] = useState('teams');
  const [showCreateMatchForm, setShowCreateMatchForm] = useState(false);
  const [newMatchData, setNewMatchData] = useState({
    timeAId: '',
    timeBId: '',
    data: '',
    hora: '',
    fase: '',
    quadraId: '', // Added for quadraId
    // Assuming quadraId will be derived from the championship or selected
  });
  
  // Estado para o formulário de registro de resultados
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchResult, setMatchResult] = useState({
    golsTimeA: 0,
    golsTimeB: 0,
    gols: [] // Para registrar os gols com jogadores
  });
  
  useEffect(() => {
    loadChampionshipData();
    // When championship data is loaded, set the quadraId for new matches
    // assuming the championship is directly linked to a quadra via donoQuadraId
    if (championship && championship.campeonato && championship.campeonato.donoQuadraId) {
      setNewMatchData(prev => ({ ...prev, quadraId: championship.campeonato.donoQuadraId }));
    }
  }, [id, championship]); // championship is a dependency
  
  const loadChampionshipData = async () => {
    setLoading(true);
    try {
      // Carregar detalhes do campeonato
      const champResponse = await api.get(`/api/campeonato/${id}`);
      setChampionship(champResponse.data);
      
      // Carregar times inscritos
      const teamsResponse = await api.get(`/api/campeonato/${id}/times`);
      setTeams(teamsResponse.data);
      
      // Carregar partidas
      const matchesResponse = await api.get(`/api/campeonato/${id}/partidas`);
      setMatches(matchesResponse.data);
      
      // Carregar artilharia
      const scorersResponse = await api.get(`/api/campeonato/${id}/artilharia`);
      setTopScorers(scorersResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dados do campeonato:", error);
      notifyError("Não foi possível carregar os detalhes do campeonato");
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirmPayment = async (teamId) => {
    try {
      setLoading(true);
      await api.put(`/api/campeonato/${id}/confirmar-pagamento/${teamId}`);
      notifySuccess("Pagamento confirmado com sucesso!");
      
      // Recarregar times
      const teamsResponse = await api.get(`/api/campeonato/${id}/times`);
      setTeams(teamsResponse.data);
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      notifyError("Não foi possível confirmar o pagamento");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setMatchResult({
      golsTimeA: match.golsTimeA || 0,
      golsTimeB: match.golsTimeB || 0,
      gols: []
    });
  };
  
  const handleAddGoal = () => {
    setMatchResult({
      ...matchResult,
      gols: [...matchResult.gols, { jogadorId: '', timeId: '', minuto: '' }]
    });
  };
  
  const handleGoalChange = (index, field, value) => {
    const updatedGols = [...matchResult.gols];
    updatedGols[index] = {
      ...updatedGols[index],
      [field]: value
    };
    
    setMatchResult({
      ...matchResult,
      gols: updatedGols
    });
  };
  
  const handleRemoveGoal = (index) => {
    const updatedGols = [...matchResult.gols];
    updatedGols.splice(index, 1);
    
    setMatchResult({
      ...matchResult,
      gols: updatedGols
    });
  };
  
  const handleSaveResult = async (e) => {
    e.preventDefault();
    
    if (!selectedMatch) return;
    
    try {
      setLoading(true);
      
      // Validar que o número de gols bate com os gols registrados
      const totalGoalsA = matchResult.gols.filter(g => g.timeId === selectedMatch.timeAId).length;
      const totalGoalsB = matchResult.gols.filter(g => g.timeId === selectedMatch.timeBId).length;
      
      if (totalGoalsA !== parseInt(matchResult.golsTimeA) || totalGoalsB !== parseInt(matchResult.golsTimeB)) {
        notifyError("O número de gols registrados não corresponde ao placar informado");
        return;
      }
      
      await api.put(`/api/campeonato/partida/${selectedMatch.id}/resultado`, {
        golsTimeA: parseInt(matchResult.golsTimeA),
        golsTimeB: parseInt(matchResult.golsTimeB),
        gols: matchResult.gols.map(g => ({
          jogadorId: g.jogadorId,
          timeId: g.timeId,
          minuto: parseInt(g.minuto)
        }))
      });
      
      notifySuccess("Resultado registrado com sucesso!");
      setSelectedMatch(null);
      
      // Recarregar partidas e artilharia
      const matchesResponse = await api.get(`/api/campeonato/${id}/partidas`);
      setMatches(matchesResponse.data);
      
      const scorersResponse = await api.get(`/api/campeonato/${id}/artilharia`);
      setTopScorers(scorersResponse.data);
    } catch (error) {
      console.error("Erro ao registrar resultado:", error);
      notifyError("Não foi possível registrar o resultado da partida");
    } finally {
      setLoading(false);
    }
  };
  
  const handleNewMatchDataChange = (e) => {
    const { name, value } = e.target;
    setNewMatchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNewMatch = async () => {
    setLoading(true);
    try {
      if (!newMatchData.timeAId || !newMatchData.timeBId) {
        notifyError("Por favor, selecione os dois times.");
        setLoading(false);
        return;
      }
      if (newMatchData.timeAId === newMatchData.timeBId) {
        notifyError("Time A e Time B não podem ser iguais.");
        setLoading(false);
        return;
      }
      if (!newMatchData.quadraId) {
        notifyError("ID da Quadra não encontrado. Não é possível criar a partida.");
        setLoading(false);
        return;
      }

      // Ensure date and time are correctly formatted if needed by backend
      // For now, assuming they are directly usable
      const payload = {
        ...newMatchData,
        // Backend expects championshipId in URL, other data in body
      };

      await api.post(`/api/campeonato/${id}/partidas`, payload);

      notifySuccess("Partida criada com sucesso!");
      setShowCreateMatchForm(false);
      loadChampionshipData(); // Reload all championship data, including new match
      setNewMatchData({
        timeAId: '',
        timeBId: '',
        data: '',
        hora: '',
        fase: '',
        quadraId: championship.campeonato?.donoQuadraId || '' // Reset form, preserve quadraId
      });

    } catch (error) {
      console.error("Erro ao criar partida:", error);
      notifyError(error.response?.data?.error || "Não foi possível criar a partida.");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMatch = async (matchId, data) => {
    try {
      setLoading(true);
      await api.put(`/api/campeonato/partida/${matchId}/agendar`, data);
      notifySuccess("Partida agendada com sucesso!");
      
      // Recarregar partidas
      const matchesResponse = await api.get(`/api/campeonato/${id}/partidas`);
      setMatches(matchesResponse.data);
    } catch (error) {
      console.error("Erro ao agendar partida:", error);
      notifyError("Não foi possível agendar a partida");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !championship) {
    return <div className="loading">Carregando detalhes do campeonato...</div>;
  }
  
  if (!championship) {
    return <div className="error">Campeonato não encontrado</div>;
  }
  
  return (
    <div className="championship-details-container">
      <header className="details-header">
        <div className="header-content">
          <h1>{championship.nome}</h1>
          <div className="championship-meta">
            <span className={`status-badge ${championship.status}`}>
              {championship.status === 'inscricoes' ? 'Em Inscrições' : 
               championship.status === 'em andamento' ? 'Em Andamento' : 'Finalizado'}
            </span>
            <span className="date">
              Início: {new Date(championship.data_inicio).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
        <button 
          className="back-button"
          onClick={() => navigate('/court-owner/championships')}
        >
          Voltar
        </button>
      </header>
      
      <div className="tabs">
        <button 
          className={activeTab === 'teams' ? 'active' : ''} 
          onClick={() => setActiveTab('teams')}
        >
          Times
        </button>
        <button 
          className={activeTab === 'matches' ? 'active' : ''} 
          onClick={() => setActiveTab('matches')}
        >
          Partidas
        </button>
        <button 
          className={activeTab === 'scorers' ? 'active' : ''} 
          onClick={() => setActiveTab('scorers')}
        >
          Artilharia
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'teams' && (
          <div className="teams-tab">
            <h2>Times Inscritos</h2>
            {teams.length === 0 ? (
              <p className="empty-message">Nenhum time inscrito ainda.</p>
            ) : (
              <div className="teams-table-container">
                <table className="teams-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Capitão</th>
                      <th>Status do Pagamento</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map(team => (
                      <tr key={team.id}>
                        <td>
                          <div className="team-info">
                            <div className="team-colors">
                              <div className="color primary" style={{ backgroundColor: team.primaryColor }}></div>
                              <div className="color secondary" style={{ backgroundColor: team.secondaryColor }}></div>
                            </div>
                            <span>{team.name}</span>
                          </div>
                        </td>
                        <td>{team.capitao?.name || 'N/A'}</td>
                        <td>
                          <span className={`payment-status ${team.pagamento ? 'paid' : 'pending'}`}>
                            {team.pagamento ? 'Pago' : 'Pendente'}
                          </span>
                        </td>
                        <td>
                          {!team.pagamento && (
                            <button 
                              className="confirm-button"
                              onClick={() => handleConfirmPayment(team.id)}
                            >
                              Confirmar Pagamento
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'matches' && (
          <div className="matches-tab">
            <h2>Partidas</h2>
            <button onClick={() => setShowCreateMatchForm(true)} className="action-button create-match-button">
              Criar Nova Partida
            </button>
            {matches.length === 0 ? (
              <p className="empty-message">Nenhuma partida agendada ainda.</p>
            ) : (
              <div className="matches-grid">
                {matches.map(match => (
                  <div key={match.id} className={`match-card ${selectedMatch?.id === match.id ? 'selected' : ''}`}>
                    <div className="match-header">
                      <span className="match-phase">{match.fase}</span>
                      <span className={`match-status ${match.status}`}>
                        {match.status === 'agendada' ? 'Agendada' : 
                         match.status === 'em andamento' ? 'Em Andamento' : 'Finalizada'}
                      </span>
                    </div>
                    
                    <div className="match-teams">
                      <div className="team">
                        <span>{match.timeA?.name || 'A definir'}</span>
                      </div>
                      <div className="match-score">
                        {match.status === 'finalizada' ? 
                          `${match.golsTimeA} x ${match.golsTimeB}` : 'x'}
                      </div>
                      <div className="team">
                        <span>{match.timeB?.name || 'A definir'}</span>
                      </div>
                    </div>
                    
                    <div className="match-info">
                      <p>
                        <strong>Data:</strong> {match.data ? new Date(match.data).toLocaleDateString('pt-BR') : 'A definir'}
                      </p>
                      <p>
                        <strong>Horário:</strong> {match.horario || 'A definir'}
                      </p>
                    </div>
                    
                    <div className="match-actions">
                      {match.status !== 'finalizada' && match.timeA && match.timeB && (
                        <button 
                          className="result-button"
                          onClick={() => handleSelectMatch(match)}
                        >
                          Registrar Resultado
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedMatch && (
              <div className="result-form-overlay">
                <div className="result-form-container">
                  <h3>Registrar Resultado</h3>
                  <div className="match-teams-header">
                    <span>{selectedMatch.timeA?.name}</span>
                    <span>vs</span>
                    <span>{selectedMatch.timeB?.name}</span>
                  </div>
                  
                  <form onSubmit={handleSaveResult} className="result-form">
                    <div className="score-inputs">
                      <div className="score-input">
                        <label>Gols {selectedMatch.timeA?.name}</label>
                        <input 
                          type="number" 
                          min="0"
                          value={matchResult.golsTimeA}
                          onChange={(e) => setMatchResult({...matchResult, golsTimeA: e.target.value})}
                          required
                        />
                      </div>
                      <div className="score-input">
                        <label>Gols {selectedMatch.timeB?.name}</label>
                        <input 
                          type="number" 
                          min="0"
                          value={matchResult.golsTimeB}
                          onChange={(e) => setMatchResult({...matchResult, golsTimeB: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="goals-section">
                      <div className="goals-header">
                        <h4>Registro de Gols</h4>
                        <button 
                          type="button" 
                          className="add-goal-button"
                          onClick={handleAddGoal}
                        >
                          Adicionar Gol
                        </button>
                      </div>
                      
                      {matchResult.gols.map((gol, index) => (
                        <div key={index} className="goal-entry">
                          <div className="goal-field">
                            <label>Time</label>
                            <select
                              value={gol.timeId}
                              onChange={(e) => handleGoalChange(index, 'timeId', e.target.value)}
                              required
                            >
                              <option value="">Selecione o time</option>
                              <option value={selectedMatch.timeAId}>{selectedMatch.timeA?.name}</option>
                              <option value={selectedMatch.timeBId}>{selectedMatch.timeB?.name}</option>
                            </select>
                          </div>
                          
                          <div className="goal-field">
                            <label>Jogador</label>
                            <input 
                              type="text" 
                              placeholder="ID do jogador"
                              value={gol.jogadorId}
                              onChange={(e) => handleGoalChange(index, 'jogadorId', e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="goal-field">
                            <label>Minuto</label>
                            <input 
                              type="number" 
                              min="1"
                              max="90"
                              value={gol.minuto}
                              onChange={(e) => handleGoalChange(index, 'minuto', e.target.value)}
                              required
                            />
                          </div>
                          
                          <button 
                            type="button" 
                            className="remove-goal-button"
                            onClick={() => handleRemoveGoal(index)}
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => setSelectedMatch(null)}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="save-button"
                        disabled={loading}
                      >
                        {loading ? 'Salvando...' : 'Salvar Resultado'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'scorers' && (
          <div className="scorers-tab">
            <h2>Artilharia</h2>
            {topScorers.length === 0 ? (
              <p className="empty-message">Nenhum gol registrado ainda.</p>
            ) : (
              <div className="scorers-table-container">
                <table className="scorers-table">
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Jogador</th>
                      <th>Time</th>
                      <th>Gols</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topScorers.map((scorer, index) => (
                      <tr key={index}>
                        <td>{index + 1}º</td>
                        <td>{scorer.jogador}</td>
                        <td>{scorer.time}</td>
                        <td>{scorer.gols}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create New Match Modal */}
      {showCreateMatchForm && (
        <div className="modal-overlay">
          <div className="modal-content create-match-form">
            <h3>Criar Nova Partida</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveNewMatch(); }}>
              <div className="form-group">
                <label htmlFor="timeA">Time A</label>
                <select 
                  id="timeA" 
                  name="timeAId" 
                  value={newMatchData.timeAId} 
                  onChange={handleNewMatchDataChange}
                  required
                >
                  <option value="">Selecione o Time A</option>
                  {teams.map(teamEntry => (
                    <option key={teamEntry.time.id} value={teamEntry.time.id}>
                      {teamEntry.time.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="timeB">Time B</label>
                <select 
                  id="timeB" 
                  name="timeBId" 
                  value={newMatchData.timeBId} 
                  onChange={handleNewMatchDataChange}
                  required
                >
                  <option value="">Selecione o Time B</option>
                  {teams.filter(teamEntry => teamEntry.time.id !== newMatchData.timeAId) // Prevent selecting same team
                    .map(teamEntry => (
                      <option key={teamEntry.time.id} value={teamEntry.time.id}>
                        {teamEntry.time.nome}
                      </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="data">Data</label>
                <input 
                  type="date" 
                  id="data" 
                  name="data" 
                  value={newMatchData.data} 
                  onChange={handleNewMatchDataChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="hora">Hora</label>
                <input 
                  type="time" 
                  id="hora" 
                  name="hora" 
                  value={newMatchData.hora} 
                  onChange={handleNewMatchDataChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="fase">Fase</label>
                <input 
                  type="text" 
                  id="fase" 
                  name="fase" 
                  placeholder="Ex: Rodada 1, Quartas de Final"
                  value={newMatchData.fase} 
                  onChange={handleNewMatchDataChange} 
                  required 
                />
              </div>
            </form>
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => setShowCreateMatchForm(false)}>Cancelar</button>
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Partida'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
