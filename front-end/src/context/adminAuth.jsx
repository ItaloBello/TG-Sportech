import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const AdminAuthContext = createContext({});

export const AdminAuthContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("user");
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
  }, []);

  //login
  const handleLogin = async (formData) => {
    try {
      const { data } = await api.get(
        `/api/admin/login?name=${formData.name}&password=${formData.password}`
      );

      if (data.id) {
        setAdmin(data);
        localStorage.setItem("user", JSON.stringify(data));
        console.log(localStorage.getItem("user"));
        navigate("/admin/menu");
      } else {
        alert("ERRO: email ou senha incorretos");
      }
    } catch (error) {
      alert(error.response.data.error);
      console.log(error.response.data.error);
    }
  };

  //singup
  const handleSingUp = async (formData) => {
    if (formData.password === formData.confirmPassword) {
      const response = await api.post(`/api/admin/registro`, formData);
      if (response.status == 200) navigate("/admin/login");
      else console.log(response);
    } else {
      alert("ERRO: senhas incompativeis");
    }
  };

  //logout
  const handleLogOut = () => {
    setAdmin({});
    localStorage.removeItem("user");
    navigate(`/admin/login`);
  };

//TODO: adaptar esta função para o endpoint de adm
  const handleGetNewInfos = async () => {
    const { data } = await api.get(`api/jogador/info/${player.id}`);
    console.log(data);
     if (data.id){
      setPlayer(data);
      localStorage.setItem("user", JSON.stringify(data));
    } 
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, handleLogin, handleSingUp, handleLogOut }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
