import React from "react";
import "./styles.css";
import ChampCard from "../ChampCard";
const ChampCardList = ({
  items,
  titleArray,
  srcArray,
  altArray,
  initialDateArray,
  finalDateArray,
  teamArray,
  premiationArray,
  isInProgress
}) => {
  return (
    <div className="champ-card-list">
      {Array(items)
        .fill()
        .map((currentValue, index) => {
          return (
            <ChampCard
              alt={altArray[index]}
              finalDate={finalDateArray[index]}
              initialDate={initialDateArray[index]}
              team={teamArray[index]}
              title={titleArray[index]}
              isInProgress={isInProgress}
              src={srcArray[index]}
              key={index}
              premiation={premiationArray[index]}
            />
          );
        })}
    </div>
  );
};

export default ChampCardList;
