import React from "react";
import "./styles.css";

const ChampMatch = ({ type = "",names,points,images }) => {
  let width;
  if (type == "oitavas") width = "2.7rem";
  else if (type == "quartas") width = "6.25rem";
  else if (type == "semi") width = "7.5rem";
  else width = "8rem";
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
        <p>{points[0]}-{points[1]}</p>
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
