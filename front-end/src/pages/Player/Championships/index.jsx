import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerAuthContext } from '../../../context/playerAuth';
import './styles.css';

export default function Championships() {
  const navigate = useNavigate();
  const { 
    player, 
    handleGetInProgressChampionship, 
    handleGetAvaliableChampionship,
    inProgressChampionship,
    avaliableChampionship,
    handleSetSelectedChamp
  } = useContext(PlayerAuthContext);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inProgress');
  
  useEffect(() => {
    const loadChampionships = async () => {
      setLoading(true);
      try {
        await handleGetInProgressChampionship(player.id);
        await handleGetAvaliableChampionship(player.id);
      } catch (error) {
        console.error("Erro ao carregar campeonatos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChampionships();
  }, [player.id]);
  
  const handleChampionshipClick = (championship) => {
    handleSetSelectedChamp(championship);
    navigate(`/player/championship/${championship.id}`);
  };
  
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
        </div>
      </header>
      
      <div className="championships-content">
        {loading ? (
          <div className="loading">Carregando campeonatos...</div>
        ) : (
          <>
            {activeTab === 'inProgress' && (
              <div className="championships-list">
                <h2>Campeonatos em Andamento</h2>
                {inProgressChampionship && inProgressChampionship.length > 0 ? (
                  <div className="cards-grid">
                    {inProgressChampionship.map(championship => (
                      <div 
                        key={championship.id} 
                        className="championship-card"
                        onClick={() => handleChampionshipClick(championship)}
                      >
                        <div className="championship-image">
                          <img 
                            src={championship.image} 
                            alt={championship.altImage || 'Imagem do campeonato'} 
                          />
                        </div>
                        <div className="championship-info">
                          <h3>{championship.title}</h3>
                          <p><strong>Time:</strong> {championship.subscribedTeam}</p>
                          <p><strong>Início:</strong> {championship.initialDate}</p>
                          {championship.finalDate && (
                            <p><strong>Término:</strong> {championship.finalDate}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">
                    Você não está participando de nenhum campeonato no momento.
                  </p>
                )}
              </div>
            )}
            
            {activeTab === 'available' && (
              <div className="championships-list">
                <h2>Campeonatos Disponíveis</h2>
                {avaliableChampionship && avaliableChampionship.length > 0 ? (
                  <div className="cards-grid">
                    {avaliableChampionship.map(championship => (
                      <div 
                        key={championship.id} 
                        className="championship-card"
                        onClick={() => handleChampionshipClick(championship)}
                      >
                        <div className="championship-image">
                          <img 
                            src={championship.image} 
                            alt={championship.altImage || 'Imagem do campeonato'} 
                          />
                        </div>
                        <div className="championship-info">
                          <h3>{championship.title}</h3>
                          <p><strong>Início:</strong> {championship.initialDate}</p>
                          {championship.finalDate && (
                            <p><strong>Término:</strong> {championship.finalDate}</p>
                          )}
                          {championship.premiation && (
                            <p><strong>Premiação:</strong> {championship.premiation}</p>
                          )}
                          {championship.registration && (
                            <p><strong>Inscrição:</strong> {championship.registration}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">
                    Não há campeonatos disponíveis para inscrição no momento.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
