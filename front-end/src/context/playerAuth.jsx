import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const PlayerAuthContext = createContext({});

export const PlayerAuthContextProvider = ({ children }) => {
  const [player, setPlayer] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPlayer = localStorage.getItem("user");
    if (storedPlayer) setPlayer(JSON.parse(storedPlayer));
  }, []);

  //função de login
  const handleLogin = async (dataform) => {
    try {
      const { data } = await api.get(
        `/api/jogador/login?name=${dataform.name}&password=${dataform.password}`
      );

      console.log(data);

      if (data.id) {
        setPlayer(data);
        localStorage.setItem("user", JSON.stringify(data));
        console.log(localStorage.getItem("user"));
        navigate("/player/menu");
      } else {
        alert("email ou senha incorretos");
      }
    } catch (error) {
      alert(error.response.data.error);
      console.log(error.response.data.error);
      setError(error.response.data.error);
    }
  };

  //função de sing up
  const handleSingUp = (formData) => {
    if (formData.password === formData.confirmPassword) {
      api.post("/api/jogador/registro", formData);
      //api.post(`/players`,formData)
      navigate("/player/login");
    } else alert("As senhas estao diferentes");
  };
  //função de logout
  const handleLogOut = () => {
    setPlayer({});
    localStorage.removeItem("user");
    navigate("/player/login");
  };

  //função edit
  const handleEdit = (dataform) => {
    if (dataform.name == null) dataform.name = player.name;
    if (dataform.email == null) dataform.email = player.email;
    if (dataform.cellphone == null) dataform.cellphone = player.cellphone;
    if (dataform.cpf == null) dataform.cpf = player.cpf;
    api.put(`/api/jogador/edit/${player.id}`, dataform);
    alert('Dados alterados com sucesso')
    navigate('player/menu')
  };

  const handleGetNewInfos = async () => {
    const { data } = await api.get(`api/jogador/info/${player.id}`);
    console.log(data);
    if (data.id){
      setPlayer(data);
      localStorage.setItem("user", JSON.stringify(data));
    } 
      
  };
  return (
    <PlayerAuthContext.Provider
      value={{
        player,
        error,
        handleLogin,
        handleLogOut,
        handleSingUp,
        handleEdit,
        handleGetNewInfos,
      }}
    >
      {children}
    </PlayerAuthContext.Provider>
  );
};
