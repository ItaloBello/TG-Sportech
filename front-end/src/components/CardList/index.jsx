import React from "react";
import TeamCard from "../TeamCard";
import "./styles.css";

const CardList = ({
  items,
  names,
  dates,
  buttonLabelsArray,
  buttonColorsArray,
  srcArray,
  altArray,
  addPlayerType,
}) => {
  return (
    <div className="card-list">
      {Array(items)
        .fill()
        .map((currentValue, index) => {
          return (
            <TeamCard
              src={srcArray[index]}
              alt={altArray[index]}
              name={names[index]}
              date={dates[index]}
              buttonLabels={buttonLabelsArray}
              buttonColors={buttonColorsArray}
              addPlayer={addPlayerType}
              key={index}
            />
          );
        })}
    </div>
  );
};

export default CardList;
