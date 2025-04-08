import { useContext } from "react";
import {AdminAuthContext} from "../context/adminAuth"

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) throw Error("Sem contexto de autenticaçao do admin");

  return context;
};