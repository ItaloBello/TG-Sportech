import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerAuthContext } from '../../../context/playerAuth';
import { notifySuccess, notifyError } from '../../../utils/notify';
import './styles.css';

export default function Friendlies() {
  const navigate = useNavigate();
  const { 
    player, 
    handleGetTeamsByCaptain, 
    handleGetPendingAmistosos, 
    handleGetTeamAmistosos,
    handleCreateAmistoso,
    handleRespondAmistoso
  } = useContext(PlayerAuthContext);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [pendingFriendlies, setPendingFriendlies] = useState([]);
  const [allFriendlies, setAllFriendlies] = useState([]);
  
  // Estado para o formulário de criação de amistoso
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    timeDesafianteId: '',
    timeDesafiadoId: '',
    data: '',
    horario: '',
    valor: ''
  });
  
  useEffect(() => {
    loadTeams();
  }, [player]);
  
  const loadTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await handleGetTeamsByCaptain(player.id);
      setTeams(teamsData || []);
      
      if (teamsData && teamsData.length > 0) {
        setSelectedTeam(teamsData[0].id);
        await loadFriendlies(teamsData[0].id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro ao carregar times:", error);
      notifyError("Não foi possível carregar seus times");
      setLoading(false);
    }
  };
  
  const loadFriendlies = async (teamId) => {
    try {
      setLoading(true);
      
      // Carregar amistosos pendentes
      const pendingData = await handleGetPendingAmistosos(teamId);
      setPendingFriendlies(pendingData || []);
      
      // Carregar todos os amistosos
      const allData = await handleGetTeamAmistosos(teamId);
      setAllFriendlies(allData || []);
    } catch (error) {
      console.error("Erro ao carregar amistosos:", error);
      notifyError("Não foi possível carregar os amistosos");
    } finally {
      setLoading(false);
    }
  };
  
  const handleTeamChange = async (e) => {
    const teamId = e.target.value;
    setSelectedTeam(teamId);
    await loadFriendlies(teamId);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCreateFriendly = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validações básicas
      if (!formData.timeDesafianteId || !formData.timeDesafiadoId || !formData.data || !formData.horario) {
        notifyError("Preencha todos os campos obrigatórios");
        setLoading(false);
        return;
      }
      
      // Converter valor para número
      const dataToSend = {
        ...formData,
        valor: parseFloat(formData.valor) || 0
      };
      
      await handleCreateAmistoso(dataToSend);
      
      notifySuccess("Desafio de amistoso enviado com sucesso!");
      setShowCreateForm(false);
      setFormData({
        timeDesafianteId: selectedTeam,
        timeDesafiadoId: '',
        data: '',
        horario: '',
        valor: ''
      });
      
      // Recarregar amistosos
      await loadFriendlies(selectedTeam);
    } catch (error) {
      console.error("Erro ao criar amistoso:", error);
      notifyError("Não foi possível enviar o desafio");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRespond = async (amistosoId, resposta) => {
    try {
      setLoading(true);
      await handleRespondAmistoso(amistosoId, resposta);
      
      if (resposta) {
        notifySuccess("Desafio aceito com sucesso!");
      } else {
        notifySuccess("Desafio recusado.");
      }
      
      // Recarregar amistosos
      await loadFriendlies(selectedTeam);
    } catch (error) {
      console.error("Erro ao responder amistoso:", error);
      notifyError("Não foi possível responder ao desafio");
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não definida';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'aceito':
        return 'Aceito';
      case 'recusado':
        return 'Recusado';
      case 'finalizado':
        return 'Finalizado';
      default:
        return status;
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'pendente':
        return 'status-pending';
      case 'aceito':
        return 'status-accepted';
      case 'recusado':
        return 'status-rejected';
      case 'finalizado':
        return 'status-finished';
      default:
        return '';
    }
  };
  
  return (
    <div className="friendlies-container">
      <header className="friendlies-header">
        <h1>Amistosos</h1>
        {teams.length > 0 && (
          <button 
            className="create-button"
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setFormData({
                ...formData,
                timeDesafianteId: selectedTeam
              });
            }}
          >
            {showCreateForm ? 'Cancelar' : 'Desafiar Time'}
          </button>
        )}
      </header>
      
      {teams.length === 0 ? (
        <div className="no-teams-message">
          <p>Você não possui times para gerenciar amistosos.</p>
          <button 
            className="create-team-button"
            onClick={() => navigate('/player/create-team')}
          >
            Criar um Time
          </button>
        </div>
      ) : (
        <>
          <div className="team-selector">
            <label htmlFor="team-select">Selecione um time:</label>
            <select 
              id="team-select" 
              value={selectedTeam || ''}
              onChange={handleTeamChange}
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          
          {showCreateForm && (
            <div className="create-form-container">
              <h2>Desafiar um Time</h2>
              <form onSubmit={handleCreateFriendly} className="friendly-form">
                <div className="form-group">
                  <label htmlFor="timeDesafiadoId">Time Adversário</label>
                  <input
                    type="text"
                    id="timeDesafiadoId"
                    name="timeDesafiadoId"
                    placeholder="ID do time adversário"
                    value={formData.timeDesafiadoId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="data">Data</label>
                    <input
                      type="date"
                      id="data"
                      name="data"
                      value={formData.data}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="horario">Horário</label>
                    <input
                      type="time"
                      id="horario"
                      name="horario"
                      value={formData.horario}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="valor">Valor (R$)</label>
                  <input
                    type="number"
                    id="valor"
                    name="valor"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.valor}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar Desafio'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="tabs">
            <button 
              className={activeTab === 'pending' ? 'active' : ''} 
              onClick={() => setActiveTab('pending')}
            >
              Pendentes
            </button>
            <button 
              className={activeTab === 'all' ? 'active' : ''} 
              onClick={() => setActiveTab('all')}
            >
              Todos
            </button>
          </div>
          
          <div className="friendlies-list">
            {loading ? (
              <div className="loading">Carregando amistosos...</div>
            ) : (
              <>
                {activeTab === 'pending' && (
                  <>
                    {pendingFriendlies.length === 0 ? (
                      <div className="empty-message">
                        Nenhum amistoso pendente encontrado.
                      </div>
                    ) : (
                      <div className="friendly-cards">
                        {pendingFriendlies.map(friendly => (
                          <div key={friendly.id} className="friendly-card">
                            <div className="card-header">
                              <h3>Desafio de Amistoso</h3>
                              <span className={`status-badge ${getStatusClass(friendly.status)}`}>
                                {getStatusLabel(friendly.status)}
                              </span>
                            </div>
                            
                            <div className="card-body">
                              <div className="teams-info">
                                <div className="team">
                                  <strong>{friendly.timeDesafiante.name}</strong>
                                  <span>Desafiante</span>
                                </div>
                                <div className="vs">VS</div>
                                <div className="team">
                                  <strong>{friendly.timeDesafiado.name}</strong>
                                  <span>Desafiado</span>
                                </div>
                              </div>
                              
                              <div className="friendly-details">
                                <p><strong>Data:</strong> {formatDate(friendly.data)}</p>
                                <p><strong>Horário:</strong> {friendly.horario || 'Não definido'}</p>
                                <p><strong>Valor:</strong> R$ {parseFloat(friendly.valor).toFixed(2)}</p>
                              </div>
                              
                              {friendly.timeDesafiadoId === selectedTeam && friendly.status === 'pendente' && (
                                <div className="response-actions">
                                  <button 
                                    className="accept-button"
                                    onClick={() => handleRespond(friendly.id, true)}
                                    disabled={loading}
                                  >
                                    Aceitar
                                  </button>
                                  <button 
                                    className="reject-button"
                                    onClick={() => handleRespond(friendly.id, false)}
                                    disabled={loading}
                                  >
                                    Recusar
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
                
                {activeTab === 'all' && (
                  <>
                    {allFriendlies.length === 0 ? (
                      <div className="empty-message">
                        Nenhum amistoso encontrado.
                      </div>
                    ) : (
                      <div className="friendly-cards">
                        {allFriendlies.map(friendly => (
                          <div key={friendly.id} className="friendly-card">
                            <div className="card-header">
                              <h3>Amistoso</h3>
                              <span className={`status-badge ${getStatusClass(friendly.status)}`}>
                                {getStatusLabel(friendly.status)}
                              </span>
                            </div>
                            
                            <div className="card-body">
                              <div className="teams-info">
                                <div className="team">
                                  <strong>{friendly.timeDesafiante.name}</strong>
                                  <span>Desafiante</span>
                                </div>
                                <div className="vs">VS</div>
                                <div className="team">
                                  <strong>{friendly.timeDesafiado.name}</strong>
                                  <span>Desafiado</span>
                                </div>
                              </div>
                              
                              <div className="friendly-details">
                                <p><strong>Data:</strong> {formatDate(friendly.data)}</p>
                                <p><strong>Horário:</strong> {friendly.horario || 'Não definido'}</p>
                                <p><strong>Valor:</strong> R$ {parseFloat(friendly.valor).toFixed(2)}</p>
                              </div>
                              
                              {friendly.status === 'finalizado' && (
                                <div className="result">
                                  <p className="result-title">Resultado:</p>
                                  <div className="score">
                                    <span>{friendly.timeDesafiante.name}</span>
                                    <strong>{friendly.golsTimeDesafiante} x {friendly.golsTimeDesafiado}</strong>
                                    <span>{friendly.timeDesafiado.name}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
