import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerAuthContext } from '../../../context/playerAuth';
import './styles.css';

export default function  Championships() {
  const navigate = useNavigate();
  const { 
    player, 
    handleGetInProgressChampionship, 
    handleGetAvaliableChampionship, 
    handleGetFinishedChampionships,
    inProgressChampionship, 
    avaliableChampionship, 
    finishedChampionships,
    handleSetSelectedChamp,
    myTeams,
    handleGetMyTeams,
    handleSubscribeTeamToChampionship
  } = useContext(PlayerAuthContext);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inProgress');
  
  useEffect(() => {
    const loadChampionships = async () => {
      setLoading(true);
      try {
        await handleGetInProgressChampionship();
        await handleGetAvaliableChampionship(player.id);
        await handleGetFinishedChampionships();
        await handleGetMyTeams(player.id);
      } catch (error) {
        console.error("Erro ao carregar campeonatos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadChampionships();
  }, [player.id]);
  
    const handleChampionshipClick = (championship) => {
    if (!championship || !championship.id) return;

    // Only navigate to progress page if the championship is in progress or finished
    if (championship.status === 'em andamento' || championship.status === 'finalizado') {
      handleSetSelectedChamp(championship);
      navigate(`/player/championship-progress/playoffs/${championship.id}`);
    }
    // For 'inscricoes' or 'não iniciado', clicking the card/image won't navigate.
    // The "Inscrever Time" button handles the primary action for these statuses.
  };
  
  // Estado para modal de inscrição
  const [showModal, setShowModal] = useState(false);
  const [selectedChampToSubscribe, setSelectedChampToSubscribe] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [feedback, setFeedback] = useState(null);
  
  const handleOpenSubscribeModal = (championship) => {
    setSelectedChampToSubscribe(championship);
    setShowModal(true);
    setSelectedTeamId('');
    setFeedback(null);
  };

  // Fecha o modal automaticamente se o campeonato sumir da lista
  useEffect(() => {
    if (
      showModal &&
      selectedChampToSubscribe &&
      (!avaliableChampionship || !avaliableChampionship.find(c => c.id === selectedChampToSubscribe.id))
    ) {
      setShowModal(false);
      setSelectedChampToSubscribe(null);
      setSelectedTeamId('');
      setFeedback({ type: 'error', message: 'Este campeonato não está mais disponível para inscrição.' });
    }
  }, [avaliableChampionship, showModal, selectedChampToSubscribe]);
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChampToSubscribe(null);
    setSelectedTeamId('');
    setFeedback(null);
  };

  const handleSubscribe = async () => {
    if (!selectedTeamId) {
      setFeedback({ type: 'error', message: 'Selecione um time!' });
      return;
    }
    const res = await handleSubscribeTeamToChampionship(selectedTeamId, selectedChampToSubscribe.id);
    setFeedback(res);
    if (res.success) {
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    }
  };

  console.log('COMPONENTE: Campeonatos disponíveis recebidos:', avaliableChampionship);
  return (
    <div className="championships-container">
      <header className="championships-header">
        <h1>Campeonatos</h1>
        <div className="tabs">
          <button 
            className={activeTab === 'inProgress' ? 'active' : ''} 
            onClick={() => setActiveTab('inProgress')}
          >
            Em Andamento
          </button>
          <button 
            className={activeTab === 'available' ? 'active' : ''} 
            onClick={() => setActiveTab('available')}
          >
            Disponíveis
          </button>
          <button 
            className={activeTab === 'finished' ? 'active' : ''} 
            onClick={() => setActiveTab('finished')}
          >
            Concluídos
          </button>
        </div>
      </header>
      
      <div className="championships-content">
        {loading ? (
          <div className="loading">Carregando campeonatos...</div>
        ) : (
          <div className="championships-section">
            {activeTab === 'inProgress' && (
              <div className="championship-list">
                <h2>Campeonatos em Andamento</h2>
                {inProgressChampionship.length === 0 ? (
                  <p>Não há campeonatos em andamento no momento.</p>
                ) : (
                  <div className="cards-grid">
                    {inProgressChampionship.map(championship => (
                      <div 
                        key={championship.id} 
                        className="championship-card"
                        onClick={() => handleChampionshipClick(championship)}
                      >
                        <div className="championship-image">
                          <img 
                            src="../../../../public/copa-fatec-icon.png"
                            alt={championship.title || 'Imagem do campeonato'} 
                          />
                        </div>
                        <div className="championship-info">
                          <h3>{championship.title}</h3>
                          <p><strong>Início:</strong> {championship.initialDate}</p>
                          <p><strong>Status:</strong> {championship.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'available' && (
              <div className="championship-list">
                <h2>Campeonatos Disponíveis</h2>
                {avaliableChampionship.length === 0 ? (
                  <p>Não há campeonatos disponíveis para inscrição no momento.</p>
                ) : (
                  <div className="cards-grid">
                    {avaliableChampionship.map(championship => (
                      <div 
                        key={championship.id} 
                        className="championship-card"
                      >
                        <div className="championship-image" onClick={() => handleChampionshipClick(championship)}>
                          <img 
                            src="../../../../public/copa-fatec-icon.png"
                            alt={championship.title || 'Imagem do campeonato'} 
                          />
                        </div>
                        <div className="championship-info">
                          <h3>{championship.title}</h3>
                          <p><strong>Início:</strong> {championship.initialDate}</p>
                          {championship.premiation && (
                            <p><strong>Premiação:</strong> R$ {championship.premiation}</p>
                          )}
                          {championship.registration && (
                            <p><strong>Inscrição:</strong> R$ {championship.registration}</p>
                          )}
                          <button className="subscribe-btn" onClick={() => handleOpenSubscribeModal(championship)}>
                            Inscrever Time
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'finished' && (
              <div className="championship-list">
                <h2>Campeonatos Concluídos</h2>
                {finishedChampionships.length === 0 ? (
                  <p>Não há campeonatos concluídos.</p>
                ) : (
                  <div className="cards-grid">
                    {finishedChampionships.map(championship => (
                      <div 
                        key={championship.id} 
                        className="championship-card"
                        onClick={() => handleChampionshipClick(championship)}
                      >
                        <div className="championship-image">
                          <img 
                            src="../../../../public/copa-fatec-icon.png"
                            alt={championship.title || 'Imagem do campeonato'} 
                          />
                        </div>
                        <div className="championship-info">
                          <h3>{championship.title}</h3>
                          <p><strong>Data:</strong> {championship.initialDate}</p>
                          <p><strong>Premiação:</strong> R$ {championship.premiation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Modal de inscrição */}
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Inscrever Time em {selectedChampToSubscribe?.title}</h3>
                  {(!myTeams || myTeams.length === 0) ? (
                    <p>Você não possui nenhum time. Crie um time antes de se inscrever!</p>
                  ) : (
                    <div className='subscription-form'>
                      <label htmlFor="team-select">Selecione o time:</label>
                      <select id="team-select" className="team-select" value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)}>
                        <option value="">Selecione...</option>
                        {myTeams.map(team => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                      <button className="confirm-btn" onClick={handleSubscribe}>
                          Confirmar  
                      </button>
                    </div>
                  )}
                  {feedback && (
                    <div className={`feedback-message ${feedback.success ? 'success' : 'error'}`}>{feedback.message}</div>
                  )}
                  <button className="close-btn" onClick={handleCloseModal}>Fechar</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
