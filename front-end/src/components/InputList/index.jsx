import React from "react";
import InputItem from "../InputItem";
import "./styles.css"


const InputList = ({ items, labels, placeholders }) => {
  return (
    <div className="item-list">
      {Array(items)
        .fill()
        .map((currentValue, index) => {
            return (
              <InputItem
                placeholder={placeholders[index]}
                label={labels[index]}
                key={index}
              />
            );
       
            //else if(type === "menu-item")
        })}
    </div>
  );
};

export default InputList;
