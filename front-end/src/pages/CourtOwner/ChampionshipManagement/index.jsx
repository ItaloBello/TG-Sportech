import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { AdminAuthContext } from '../../../context/adminAuth';
import { notifySuccess, notifyError } from '../../../utils/notify';
import './styles.css';
import { useAdminAuth } from "../../../hooks/useAdminAuth";

export default function ChampionshipManagement() {
  const navigate = useNavigate();
  const { admin } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [championships, setChampionships] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState('');

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

  // Buscar quadras do admin ao carregar
  // Buscar quadras do admin ao carregar
  useEffect(() => {
    if (admin && admin.id) {
      api.get(`/api/admin/quadras/${admin.id}`)
        .then(res => setCourts(res.data))
        .catch(() => notifyError("Erro ao buscar quadras"));
    }
  }, [admin]);

  // Buscar campeonatos só quando quadra estiver selecionada
  useEffect(() => {
    if (selectedCourt) {
      loadChampionships(selectedCourt);
    }
  }, [selectedCourt]);

  // Carrega campeonatos da quadra selecionada
  const loadChampionships = async (courtId) => {
    setLoading(true);
    try {
      if (!courtId) {
        setChampionships([]);
        setLoading(false);
        return;
      }
      const response = await api.get(`/api/campeonato/quadra/${courtId}`);
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
      if (!selectedCourt) {
        notifyError("Selecione uma quadra para criar o campeonato.");
        return;
      }

      // Converter valores monetários para números
      // Garantir que selectedCourt seja uma string válida e depois convertê-la para número
      const courtId = selectedCourt ? parseInt(selectedCourt, 10) : null;
      
      if (!courtId) {
        notifyError("Quadra inválida selecionada. Por favor, selecione uma quadra.");
        setLoading(false);
        return;
      }
      
      const dataToSend = {
        name: formData.nome,
        initialDate: formData.data_inicio,
        premiation: parseFloat(formData.premiacao) || 0,
        registration: parseFloat(formData.registro) || 0,
        teamsNumber: parseInt(formData.max_times) || 16,
        description: formData.descricao,
        status: formData.status,
        quadraId: courtId // Usando o ID da quadra como número
      };
      console.log('Enviando para backend:', dataToSend);

      if (!admin || !admin.id) {
        notifyError("Usuário não autenticado. Faça login novamente.");
        setLoading(false);
        return;
      }
      const response = await api.post(`/api/admin/campeonato/${admin.id}`, dataToSend);

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
      loadChampionships(selectedCourt);
    } catch (error) {
      console.error("Erro ao criar campeonato:", error);
      notifyError(error.response?.data?.error || "Erro ao criar campeonato");
    } finally {
      setLoading(false);
    }
  };

  
  const handleViewChampionship = (championship) => {
    if (!championship || !championship.id) {
      console.error("Championship data is missing.");
      notifyError("Não foi possível carregar os detalhes do campeonato.");
      return;
    }

    if (championship.status === 'inscricoes' || championship.status === 'não iniciado') {
      navigate(`/admin/edit-championship/${championship.id}`);
    } else if (championship.status === 'em andamento' || championship.status === 'finalizado') {
      navigate(`/admin/view-championship-progress/${championship.id}`);
    } else {
      // Fallback for any other status
      console.warn(`Unhandled championship status: ${championship.status}`);
      navigate(`/admin/edit-championship/${championship.id}`);
    }
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
    
    // Mapeamento dos status do backend para as categorias da interface
    switch (activeTab) {
      case 'inscricoes':
        return championship.status === 'inscricoes' || championship.status === 'não iniciado';
      case 'em andamento':
        return championship.status === 'em andamento';
      case 'finalizado':
        return championship.status === 'finalizado';
      default:
        return false;
    }
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

      {/* Select de quadras */}
      <div style={{ margin: '20px 0' }}>
        <label htmlFor="court-select"><strong>Selecione a quadra:</strong></label>
        <select
          id="court-select"
          value={selectedCourt}
          onChange={e => setSelectedCourt(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option value="">Selecione...</option>
          {courts.map(court => (
            <option key={court.id} value={court.id}>{court.name}</option>
          ))}
        </select>
      </div>

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
                        {championship.status === 'inscricoes' || championship.status === 'não iniciado'
  ? 'Em Inscrições'
  : championship.status === 'em andamento'
  ? 'Em Andamento'
  : 'Finalizado'
}
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
                        onClick={() => handleViewChampionship(championship)}
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
