import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import SelectChampCard from "../../../components/SelectChampCard";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

//TODO GERAR INTEGRAÇÂO

const SelectInProgressChamp = () => {
  const { admin, inProgressChamp, handleGetInProgressChamp } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getChamp = async () => {
      try {
        await handleGetInProgressChamp(admin.id);
      } finally {
        setIsLoading(false);
      }
    };
    getChamp();
    console.log(inProgressChamp);
  }, [admin?.id]);

  if (isLoading) return <></>;

  return (
    <div className="select-champ">
      <Header />
      <div className="select-champ__championships">
        {inProgressChamp.map((champ, index) => (
          <SelectChampCard title={champ.name} isInProgress={true} key={index}/>
        ))}
      </div>
    </div>
  );
};

export default SelectInProgressChamp;
