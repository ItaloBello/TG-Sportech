import { useContext } from "react";
import { PlayerAuthContext } from "../context/playerAuth";

export const usePlayerAuth = () => {
  const context = useContext(PlayerAuthContext);

  if (!context) throw Error("Sem contexto de autenticaçao do player");

  return context;
};
