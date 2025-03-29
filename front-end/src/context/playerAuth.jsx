import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const PlayerAuthContext = createContext({});

export const PlayerAuthContextProvider = ({ children }) => {
  const [player, setPlayer] = useState({});
  const navigate = useNavigate();

  //função de login
  const handleLogin = async (dataform) => {
    try {
      const { data } = await api.get(
        `players?name=${dataform.name}&password=${dataform.password}`
      );

      if (data.length === 1) {
        setPlayer(data[0]);
        navigate("/player/menu");
      } else {
        alert("email ou senha incorretos");
      }
    } catch (error) {
      alert("houve um erro, tente novamente");
    }
  };

  //função de sing up
  const handleSingUp = (formData) => {
    if(formData.password === formData.confirmPassword){
      api.post("/players", formData);
      navigate("/player/login");
    }
    else
      alert("As senhas estao diferentes")
  };
  //função de logout
  const handleLogOut = () => {
    setPlayer({});
    navigate("/player/login");
  };

  return (
    <PlayerAuthContext.Provider
      value={{ player, handleLogin, handleLogOut, handleSingUp }}
    >
      {children}
    </PlayerAuthContext.Provider>
  );
};
