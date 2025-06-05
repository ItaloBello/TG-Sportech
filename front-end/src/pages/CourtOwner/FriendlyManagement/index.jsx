import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { notifySuccess, notifyError } from '../../../utils/notify';
import './styles.css';

export default function FriendlyManagement() {
  const [loading, setLoading] = useState(true);
  const [friendlies, setFriendlies] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  
  // Estado para o modal de registro de resultado
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedFriendly, setSelectedFriendly] = useState(null);
  const [resultData, setResultData] = useState({
    golsTimeDesafiante: 0,
    golsTimeDesafiado: 0,
    pagamentoConfirmado: false
  });
  
  useEffect(() => {
    loadFriendlies();
  }, [activeTab]);
  
  const loadFriendlies = async () => {
    setLoading(true);
    try {
      let endpoint = '/api/amistoso/quadra';
      
      if (activeTab === 'pending') {
        endpoint += '/pendentes';
      } else if (activeTab === 'today') {
        endpoint += '/hoje';
      } else if (activeTab === 'upcoming') {
        endpoint += '/futuros';
      } else {
        endpoint += '/finalizados';
      }
      
      const response = await api.get(endpoint);
      setFriendlies(response.data);
    } catch (error) {
      console.error("Erro ao carregar amistosos:", error);
      notifyError("Não foi possível carregar os amistosos");
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirmPayment = async (friendlyId) => {
    try {
      setLoading(true);
      await api.put(`/api/amistoso/${friendlyId}/confirmar-pagamento`);
      notifySuccess("Pagamento confirmado com sucesso!");
      loadFriendlies();
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      notifyError("Não foi possível confirmar o pagamento");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectFriendly = (friendly) => {
    setSelectedFriendly(friendly);
    setResultData({
      golsTimeDesafiante: 0,
      golsTimeDesafiado: 0,
      pagamentoConfirmado: friendly.pagamentoConfirmado || false
    });
    setShowResultModal(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setResultData({
      ...resultData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSaveResult = async (e) => {
    e.preventDefault();
    
    if (!selectedFriendly) return;
    
    try {
      setLoading(true);
      
      const dataToSend = {
        golsTimeDesafiante: parseInt(resultData.golsTimeDesafiante),
        golsTimeDesafiado: parseInt(resultData.golsTimeDesafiado),
        pagamentoConfirmado: resultData.pagamentoConfirmado
      };
      
      await api.put(`/api/amistoso/${selectedFriendly.id}/resultado`, dataToSend);
      
      notifySuccess("Resultado registrado com sucesso!");
      setShowResultModal(false);
      setSelectedFriendly(null);
      loadFriendlies();
    } catch (error) {
      console.error("Erro ao registrar resultado:", error);
      notifyError("Não foi possível registrar o resultado");
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não definida';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  const getStatusLabel = (friendly) => {
    if (friendly.status === 'finalizado') return 'Finalizado';
    if (friendly.status === 'aceito') {
      if (!friendly.pagamentoConfirmado) return 'Aguardando Pagamento';
      return 'Confirmado';
    }
    return friendly.status.charAt(0).toUpperCase() + friendly.status.slice(1);
  };
  
  const getStatusClass = (friendly) => {
    if (friendly.status === 'finalizado') return 'status-finished';
    if (friendly.status === 'aceito') {
      if (!friendly.pagamentoConfirmado) return 'status-waiting-payment';
      return 'status-confirmed';
    }
    if (friendly.status === 'pendente') return 'status-pending';
    if (friendly.status === 'recusado') return 'status-rejected';
    return '';
  };
  
  return (
    <div className="friendly-management-container">
      <header className="management-header">
        <h1>Gerenciamento de Amistosos</h1>
      </header>
      
      <div className="tabs">
        <button 
          className={activeTab === 'pending' ? 'active' : ''} 
          onClick={() => setActiveTab('pending')}
        >
          Pendentes
        </button>
        <button 
          className={activeTab === 'today' ? 'active' : ''} 
          onClick={() => setActiveTab('today')}
        >
          Hoje
        </button>
        <button 
          className={activeTab === 'upcoming' ? 'active' : ''} 
          onClick={() => setActiveTab('upcoming')}
        >
          Próximos
        </button>
        <button 
          className={activeTab === 'finished' ? 'active' : ''} 
          onClick={() => setActiveTab('finished')}
        >
          Finalizados
        </button>
      </div>
      
      <div className="friendlies-list">
        {loading ? (
          <div className="loading">Carregando amistosos...</div>
        ) : (
          <>
            {friendlies.length === 0 ? (
              <div className="empty-message">
                Nenhum amistoso encontrado nesta categoria.
              </div>
            ) : (
              <div className="friendly-cards">
                {friendlies.map(friendly => (
                  <div key={friendly.id} className="friendly-card">
                    <div className="card-header">
                      <h3>Amistoso #{friendly.id}</h3>
                      <span className={`status-badge ${getStatusClass(friendly)}`}>
                        {getStatusLabel(friendly)}
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
                        <p><strong>Pagamento:</strong> {friendly.pagamentoConfirmado ? 'Confirmado' : 'Pendente'}</p>
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
                      
                      <div className="card-actions">
                        {friendly.status === 'aceito' && !friendly.pagamentoConfirmado && (
                          <button 
                            className="payment-button"
                            onClick={() => handleConfirmPayment(friendly.id)}
                            disabled={loading}
                          >
                            Confirmar Pagamento
                          </button>
                        )}
                        
                        {friendly.status === 'aceito' && friendly.pagamentoConfirmado && (
                          <button 
                            className="result-button"
                            onClick={() => handleSelectFriendly(friendly)}
                            disabled={loading}
                          >
                            Registrar Resultado
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {showResultModal && selectedFriendly && (
        <div className="result-modal-overlay">
          <div className="result-modal">
            <h3>Registrar Resultado</h3>
            
            <div className="teams-header">
              <span>{selectedFriendly.timeDesafiante.name}</span>
              <span>vs</span>
              <span>{selectedFriendly.timeDesafiado.name}</span>
            </div>
            
            <form onSubmit={handleSaveResult} className="result-form">
              <div className="score-inputs">
                <div className="score-input">
                  <label>Gols {selectedFriendly.timeDesafiante.name}</label>
                  <input 
                    type="number" 
                    name="golsTimeDesafiante"
                    min="0"
                    value={resultData.golsTimeDesafiante}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="score-input">
                  <label>Gols {selectedFriendly.timeDesafiado.name}</label>
                  <input 
                    type="number" 
                    name="golsTimeDesafiado"
                    min="0"
                    value={resultData.golsTimeDesafiado}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              {!selectedFriendly.pagamentoConfirmado && (
                <div className="payment-confirmation">
                  <label>
                    <input 
                      type="checkbox" 
                      name="pagamentoConfirmado"
                      checked={resultData.pagamentoConfirmado}
                      onChange={handleInputChange}
                    />
                    Confirmar pagamento
                  </label>
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowResultModal(false);
                    setSelectedFriendly(null);
                  }}
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
  );
}
