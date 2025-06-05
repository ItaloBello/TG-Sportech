import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { notifySuccess, notifyError } from '../../../utils/notify';
import './styles.css';

export default function ChampionshipManagement() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [championships, setChampionships] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Estados para o formulário de criação
  const [formData, setFormData] = useState({
    nome: '',
    data_inicio: '',
    premiacao: '',
    registro: '',
    descricao: '',
    max_times: 16,
    status: 'inscricoes'
  });
  
  useEffect(() => {
    loadChampionships();
  }, []);
  
  const loadChampionships = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/campeonato/dono');
      setChampionships(response.data);
    } catch (error) {
      console.error("Erro ao carregar campeonatos:", error);
      notifyError("Não foi possível carregar os campeonatos");
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCreateChampionship = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validações básicas
      if (!formData.nome || !formData.data_inicio) {
        notifyError("Nome e data de início são obrigatórios");
        return;
      }
      
      // Converter valores monetários para números
      const dataToSend = {
        ...formData,
        premiacao: parseFloat(formData.premiacao) || 0,
        registro: parseFloat(formData.registro) || 0,
        max_times: parseInt(formData.max_times) || 16
      };
      
      const response = await api.post('/api/campeonato', dataToSend);
      
      notifySuccess("Campeonato criado com sucesso!");
      setShowCreateForm(false);
      setFormData({
        nome: '',
        data_inicio: '',
        premiacao: '',
        registro: '',
        descricao: '',
        max_times: 16,
        status: 'inscricoes'
      });
      
      // Recarregar a lista de campeonatos
      loadChampionships();
    } catch (error) {
      console.error("Erro ao criar campeonato:", error);
      notifyError(error.response?.data?.error || "Erro ao criar campeonato");
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewChampionship = (championshipId) => {
    navigate(`/court-owner/championship/${championshipId}`);
  };
  
  const handleGenerateMatches = async (championshipId) => {
    try {
      setLoading(true);
      await api.post(`/api/campeonato/${championshipId}/gerar-chaves`);
      notifySuccess("Chaves geradas com sucesso!");
      loadChampionships();
    } catch (error) {
      console.error("Erro ao gerar chaves:", error);
      notifyError(error.response?.data?.error || "Erro ao gerar chaves do campeonato");
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartChampionship = async (championshipId) => {
    try {
      setLoading(true);
      await api.put(`/api/campeonato/${championshipId}/iniciar`);
      notifySuccess("Campeonato iniciado com sucesso!");
      loadChampionships();
    } catch (error) {
      console.error("Erro ao iniciar campeonato:", error);
      notifyError(error.response?.data?.error || "Erro ao iniciar o campeonato");
    } finally {
      setLoading(false);
    }
  };
  
  const filteredChampionships = championships.filter(championship => {
    if (activeTab === 'all') return true;
    return championship.status === activeTab;
  });
  
  return (
    <div className="championship-management-container">
      <header className="management-header">
        <h1>Gerenciamento de Campeonatos</h1>
        <button 
          className="create-button"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancelar' : 'Criar Novo Campeonato'}
        </button>
      </header>
      
      {showCreateForm && (
        <div className="create-form-container">
          <h2>Criar Novo Campeonato</h2>
          <form onSubmit={handleCreateChampionship} className="championship-form">
            <div className="form-group">
              <label htmlFor="nome">Nome do Campeonato</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="data_inicio">Data de Início</label>
              <input
                type="date"
                id="data_inicio"
                name="data_inicio"
                value={formData.data_inicio}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="premiacao">Premiação (R$)</label>
                <input
                  type="number"
                  id="premiacao"
                  name="premiacao"
                  step="0.01"
                  min="0"
                  value={formData.premiacao}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="registro">Taxa de Inscrição (R$)</label>
                <input
                  type="number"
                  id="registro"
                  name="registro"
                  step="0.01"
                  min="0"
                  value={formData.registro}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="max_times">Número Máximo de Times</label>
              <select
                id="max_times"
                name="max_times"
                value={formData.max_times}
                onChange={handleInputChange}
              >
                <option value="4">4 times</option>
                <option value="8">8 times</option>
                <option value="16">16 times</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
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
                {loading ? 'Criando...' : 'Criar Campeonato'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''} 
          onClick={() => setActiveTab('all')}
        >
          Todos
        </button>
        <button 
          className={activeTab === 'inscricoes' ? 'active' : ''} 
          onClick={() => setActiveTab('inscricoes')}
        >
          Em Inscrições
        </button>
        <button 
          className={activeTab === 'em andamento' ? 'active' : ''} 
          onClick={() => setActiveTab('em andamento')}
        >
          Em Andamento
        </button>
        <button 
          className={activeTab === 'finalizado' ? 'active' : ''} 
          onClick={() => setActiveTab('finalizado')}
        >
          Finalizados
        </button>
      </div>
      
      <div className="championships-list">
        {loading && !showCreateForm ? (
          <div className="loading">Carregando campeonatos...</div>
        ) : (
          <>
            {filteredChampionships.length === 0 ? (
              <div className="empty-message">
                Nenhum campeonato encontrado nesta categoria.
              </div>
            ) : (
              <div className="championship-cards">
                {filteredChampionships.map(championship => (
                  <div key={championship.id} className="championship-card">
                    <div className="card-header">
                      <h3>{championship.nome}</h3>
                      <span className={`status-badge ${championship.status}`}>
                        {championship.status === 'inscricoes' ? 'Em Inscrições' : 
                         championship.status === 'em andamento' ? 'Em Andamento' : 'Finalizado'}
                      </span>
                    </div>
                    
                    <div className="card-body">
                      <p><strong>Data de Início:</strong> {new Date(championship.data_inicio).toLocaleDateString('pt-BR')}</p>
                      <p><strong>Premiação:</strong> R$ {parseFloat(championship.premiacao).toFixed(2)}</p>
                      <p><strong>Taxa de Inscrição:</strong> R$ {parseFloat(championship.registro).toFixed(2)}</p>
                      <p><strong>Times Inscritos:</strong> {championship.times_inscritos || 0} / {championship.max_times}</p>
                    </div>
                    
                    <div className="card-actions">
                      <button 
                        className="view-button"
                        onClick={() => handleViewChampionship(championship.id)}
                      >
                        Ver Detalhes
                      </button>
                      
                      {championship.status === 'inscricoes' && championship.times_inscritos >= 4 && (
                        <button 
                          className="start-button"
                          onClick={() => handleStartChampionship(championship.id)}
                        >
                          Iniciar Campeonato
                        </button>
                      )}
                      
                      {championship.status === 'em andamento' && !championship.chaves_geradas && (
                        <button 
                          className="generate-button"
                          onClick={() => handleGenerateMatches(championship.id)}
                        >
                          Gerar Chaves
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
