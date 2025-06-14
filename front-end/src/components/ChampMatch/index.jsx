import React, { useState, useEffect } from "react";
import "./styles.css";

const ChampMatch = ({ 
  type = "", 
  names, 
  // points, // Assuming scores come as golsTimeA, golsTimeB from ...match
  images, 
  partidaId, 
  isAdmin, 
  onSaveResult, 
  matchStatus, // e.g., 'agendada', 'em_andamento', 'finalizada'
  golsTimeA,  // Expecting this from ...match
  golsTimeB   // Expecting this from ...match
}) => {
  let width;
  if (type == "oitavas") width = "2.7rem";
  else if (type == "quartas") width = "6.25rem";
  else if (type == "semi") width = "7.5rem";
  else width = "8rem";
    const [scoreA, setScoreA] = useState(golsTimeA !== null && golsTimeA !== undefined ? String(golsTimeA) : '');
  const [scoreB, setScoreB] = useState(golsTimeB !== null && golsTimeB !== undefined ? String(golsTimeB) : '');

  useEffect(() => {
    // Update local state if props change (e.g., after save and re-fetch)
    const currentPropScoreA = golsTimeA !== null && golsTimeA !== undefined ? String(golsTimeA) : '';
    const currentPropScoreB = golsTimeB !== null && golsTimeB !== undefined ? String(golsTimeB) : '';

    // Only update if the prop value is different from the current input state
    // This helps prevent wiping user input if parent re-renders with same data
    if (currentPropScoreA !== scoreA) {
        setScoreA(currentPropScoreA);
    }
    if (currentPropScoreB !== scoreB) {
        setScoreB(currentPropScoreB);
    }
  }, [golsTimeA, golsTimeB]); // Removed scoreA, scoreB from deps to avoid potential loops

  const handleSave = () => {
    if (onSaveResult) {
      const finalScoreA = scoreA === '' ? null : parseInt(scoreA, 10);
      const finalScoreB = scoreB === '' ? null : parseInt(scoreB, 10);
      // Basic validation to ensure scores are numbers or null if empty
      if ((scoreA !== '' && isNaN(finalScoreA)) || (scoreB !== '' && isNaN(finalScoreB))) {
        alert('Por favor, insira números válidos para os placares.');
        return;
      }
      onSaveResult(partidaId, finalScoreA, finalScoreB);
    }
  };

  // Determine if inputs should be enabled
  // Assuming 'finalizada' is the status for a completed match where scores can no longer be edited.
  // And 'agendada' or 'em_andamento' (or other non-finalized statuses) allow editing.
  const canEditScores = isAdmin && matchStatus !== 'finalizada';

  return (
    <div className="champ-match">
      <div className="champ-match__team-area">
        <img
          className="champ-match__team-area-image"
          src={images[0]}
          alt={`${names[0]} logo`}
          style={{ width: width }}
        />
        <p>{names[0]}</p>
      </div>
      <div className="champ-match__versus-area">
        <p style={{textTransform: 'capitalize'}}>{type}</p>
        <p>VS</p>
        {
          canEditScores ? (
            <div className="champ-match__score-inputs">
              <input 
                type="number" 
                value={scoreA} 
                onChange={(e) => setScoreA(e.target.value)} 
                className="champ-match__score-input"
                placeholder="Gols A"
              />
              <span>-</span>
              <input 
                type="number" 
                value={scoreB} 
                onChange={(e) => setScoreB(e.target.value)} 
                className="champ-match__score-input"
                placeholder="Gols B"
              />
              <button onClick={handleSave} className="champ-match__save-button">Salvar</button>
            </div>
          ) : (
            <p>{golsTimeA !== null && golsTimeA !== undefined ? golsTimeA : '-'} - {golsTimeB !== null && golsTimeB !== undefined ? golsTimeB : '-'}</p>
          )
        }
      </div>
      <div className="champ-match__team-area">
        <img
          className="champ-match__team-area-image"
          src={images[1]}
          alt={`${names[1]} logo`}
          style={{ width: width }}
        />
        <p>{names[1]}</p>
      </div>
    </div>
  );
};

export default ChampMatch;
