import React from "react";
import ButtonItem from "./ButtonItem";

const ButtonList = ({ items,labels,links }) => {
  return (
    <div className="item-list">
      {Array(items)
        .fill()
        .map((currentValue, index) => {
            return (
              <ButtonItem
                label={labels[index]}
                link={links[index]}
                key={index}
              />
            );
        })}
    </div>
  );
};

export default ButtonList;
