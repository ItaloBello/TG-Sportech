import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import MatchCard from "../../../components/MatchCard";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

const SelectMatch = () => {
  const { handleGetChampMatches, admin, champMatches, selectedChamp } =
    useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getMatches = async () => {
      try {
        await handleGetChampMatches(selectedChamp.id);
      } finally {
        setIsLoading(false);
      }
    };
    getMatches();
    console.log(champMatches);
  }, [admin?.id]);

  if (isLoading) return <></>;
  return (
    <div className="select-match">
      <Header />
      <div className="select-match__list">
        {champMatches.map((champ, index) => (
          <MatchCard
            date={champ.date}
            teams={champ.teams}
            title={champ.title}
            points={champ.points}
            toEdit={true}
            key={index}
          />
        ))}

      </div>
    </div>
  );
};

export default SelectMatch;
