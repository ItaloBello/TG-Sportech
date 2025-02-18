import React from "react";

const MenuList = ({ items, srcArray, altArray, links, labels }) => {
  return (
    <div className="item-list">
      {Array(items)
        .fill()
        .map((currentValue, index) => {
          return (
            <MenuList
              src={srcArray[index]}
              alt={altArray[index]}
              label={labels[index]}
              link={links[index]}
              key={index}
            />
          );
        })}
    </div>
  );
};

export default MenuList;
