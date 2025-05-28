import React, { useEffect, useState } from "react";
import "./styles.css";
import Header from "../../../components/Header";
import CourtCard from "../../../components/CourtCard";
import { useAdminAuth } from "../../../hooks/useAdminAuth";
const SelectCourt = () => {
  const { admin, myCourts, handleGetMyCourts } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getCourts = async () => {
      try {
        await handleGetMyCourts(admin.id);
      } finally {
        setIsLoading(false);
      }
    };
    getCourts();
    console.log(myCourts);
  }, []);

  if (isLoading) return <></>;

  return (
    <div className="select-court">
      <Header />
      <div className="select-court__main">
        {myCourts.map((court, index) => (
          <CourtCard name={court.name} key={index} id={court.id} />
        ))}
      </div>
    </div>
  );
};

export default SelectCourt;
