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
        {Array(champMatches.length  )
          .fill(" ")
          .map((value, index) => (
            <MatchCard
              date={champMatches[index].date}
              teams={champMatches[index].teams}
              title={champMatches[index].title}
              points={champMatches[index].points}
              toEdit={true}
            />
          ))}

      </div>
    </div>
  );
};

export default SelectMatch;
