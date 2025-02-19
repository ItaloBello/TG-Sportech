import React from "react";
import MenuItem from "./MenuItem";

const MenuList = ({ items, srcArray, altArray, links, labels, colors }) => {
  return (
    <div className="item-list">
      {Array(items)
        .fill()
        .map((currentValue, index) => {
          return (
            <MenuItem
              src={srcArray[index]}
              alt={altArray[index]}
              label={labels[index]}
              //link={links[index]}
              color={colors[index]}
              key={index}
            />
          );
        })}
    </div>
  );
};

export default MenuList;
