import React, { useEffect, useState } from "react";
import "./styles.css";
import Header from "../../../components/Header";
import SelectChampCard from "../../../components/SelectChampCard";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

//TODO GERAR INTEGRAÇÂO

const SelectNotStartedChamp = () => {
  const { handleGetNotStartedChamp, admin, notStartedChamp } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getChamp = async () => {
      try {
        await handleGetNotStartedChamp(admin.id);
      } finally {
        setIsLoading(false);
      }
    };
    getChamp();
    console.log(notStartedChamp);
  }, [admin?.id]);

  if (isLoading) return <></>;

  return (
    <div className="select-champ">
      <Header />
      <div className="select-champ__championships">
        {notStartedChamp.map((champ, index) => (
          <SelectChampCard title={champ.name} key={index} />
        ))}
      </div>
    </div>
  );
};

export default SelectNotStartedChamp;
