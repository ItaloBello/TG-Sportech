import React from "react";
import ButtonItem from "./ButtonItem";

const ButtonList = ({ items, labels, links, colors }) => {
  return (
    <div className="item-list">
      {Array(items)
        .fill()
        .map((currentValue, index) => {
          return (
            <ButtonItem
              label={labels[index]}
              link={links[index]}
              color={colors[index]}
              key={index}
            />
          );
        })}
    </div>
  );
};

export default ButtonList;
