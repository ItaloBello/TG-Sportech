import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const PlayerAuthContext = createContext({});

export const PlayerAuthContextProvider = ({ children }) => {
  const [player, setPlayer] = useState({});
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  //função de login
  const handleLogin = async (dataform) => {
    try {
       const { data } = await api.get(
         `/api/jogador/login?name=${dataform.name}&password=${dataform.password}`
      );
      //const {data} = await api.get(`/players?name=${dataform.name}&password=${dataform.password}`)
      console.log(data)

      if (data.id) {
        setPlayer(data);
        navigate("/player/menu");
      } else {
        alert("email ou senha incorretos");
      }
    } catch (error) {
      alert(error.response.data.error);
      console.log(error.response.data.error)
      setError(error.response.data.error)
    }
  };

  //função de sing up
  const handleSingUp = (formData) => {
    if(formData.password === formData.confirmPassword){
      api.post("/api/jogador/registro", formData);
      //api.post(`/players`,formData)
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
      value={{ player, error, handleLogin, handleLogOut, handleSingUp }}
    >
      {children}
    </PlayerAuthContext.Provider>
  );
};
