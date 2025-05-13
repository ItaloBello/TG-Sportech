import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const PlayerAuthContext = createContext({});

export const PlayerAuthContextProvider = ({ children }) => {
  const [player, setPlayer] = useState({});
  const [error, setError] = useState(null);
  const [courts, setCourts] = useState([]);
  const [weekDaysToFilter, setWeekDaysToFilter] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [avaliableTimes, setAvaliableTimes] = useState([]);

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
    alert("Dados alterados com sucesso");
    navigate("player/menu");
  };

  const handleGetNewInfos = async () => {
    const { data } = await api.get(`api/jogador/info/${player.id}`);
    console.log(data);
    if (data.id) {
      setPlayer(data);
      localStorage.setItem("user", JSON.stringify(data));
    }
  };

  //TODO aqui vai as requisições do back
  const handleGetCourt = () => {
    //TODO requisição para pegar todas as quadras, retornar pelo menos o id e o nome de cada
    //const { data } = await api.get(`api/jogador/info/${player.id}`);
    //setCourts(data)
    setCourts([
      { name: "quadra 1", id: 1 },
      { name: "quadra 2", id: 2 },
    ]);
  };

  const handleGetWeekDaysToFilter = (selectedCourt) => {
    //TODO requisição para receber os dias da semana a serem bloqueados, que não foram cadastrados na quadra
    console.log("court id:" + selectedCourt);
    if (selectedCourt == 1) setWeekDaysToFilter([1, 3]);
    else if (selectedCourt == 2) setWeekDaysToFilter([0, 2, 5]);
  };

  const handleGetDisabledDates = (selectedCourt) => {
    //TODO requisição para retornar os dias sem agendamento disponível, ela deve retornar um array de varios Date
    if (selectedCourt == 1)
      setDisabledDates([new Date(2025, 4, 22), new Date(2025, 4, 17)]);
    else if (selectedCourt == 2) setDisabledDates([new Date(2025, 4, 19)]);
  };

  const handleGetAvaliableTimes = (selectedCourt, selectedDate) => {
    //TODO requisição para pegar os horarios de uma quadra determinada
    if ((selectedCourt == 1 && selectedDate != '24-05-2025')|| selectedDate == '24-05-2025')
      setAvaliableTimes([
        "14:00-15:00",
        "15:00-16:00",
        "16:00-17:00",
        "17:00-18:00",
      ]);
    else if (selectedCourt == 2||selectedDate=='20-05-2025')
      setAvaliableTimes(["18:00-19:00", "19:00-20:00", "20:00-21:00"]);
  };

  return (
    <PlayerAuthContext.Provider
      value={{
        player,
        error,
        courts,
        weekDaysToFilter,
        disabledDates,
        avaliableTimes,
        handleLogin,
        handleLogOut,
        handleSingUp,
        handleEdit,
        handleGetNewInfos,
        handleGetCourt,
        handleGetWeekDaysToFilter,
        handleGetDisabledDates,
        handleGetAvaliableTimes
      }}
    >
      {children}
    </PlayerAuthContext.Provider>
  );
};
