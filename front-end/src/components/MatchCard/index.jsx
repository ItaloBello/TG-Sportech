import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";

const MatchCard = ({ teams, points = [], date, title, toEdit = false }) => {
  return (
    <div className="match-card">
      <p className="match-card__text">{title}</p>
      <p className=" match-card__teams">
        <span>{teams[0]}</span>
        <span>VS</span>
        <span>{teams[1]}</span>
      </p>
      {points ? (
        <p className="match-card__teams">
            <span>{points[0]}</span>
            <span>-----</span>
            <span>{points[1]}</span>
           
        </p>
      ) : (
        <></>
      )}
      <p className="match-card__text">{date}</p>
      {toEdit?<Link to='/admin/select-championship/in-progress/select-match/edit'>Editar</Link>:<></>}
    </div>
  );
};

export default MatchCard;
