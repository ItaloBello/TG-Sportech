import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const PlayerAuthContext = createContext({});

export const PlayerAuthContextProvider = ({ children }) => {
  const [player, setPlayer] = useState({});
  const [error, setError] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedChampionship, setSelectedChampionship] = useState({});

  const [teamsByCaptain, setTeamsByCaptain] = useState([]);
  const [weekDaysToFilter, setWeekDaysToFilter] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [avaliableTimes, setAvaliableTimes] = useState([]);
  const [inProgressChampionship, setInProgressChampionship] = useState([]);
  const [avaliableChampionship, setAvaliableChampionship] = useState([]);

  const navigate = useNavigate();

  //este useEffect controla os dados armazenados em localStorage e os passa para as variaveis de estado
  useEffect(() => {
    const storedPlayer = localStorage.getItem("user");
    if (storedPlayer) setPlayer(JSON.parse(storedPlayer));

    const storedSelectedChampionship = localStorage.getItem("champ");
    if (storedSelectedChampionship)
      setSelectedChampionship(JSON.parse(storedSelectedChampionship));
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

  const handleGetCourt = async () => {
    const { data } = await api.get("/api/jogador/quadras");
    setCourts(data);
  };

  const handleGetTeamsByCaptain = (playerId) => {
    //TODO Requisição para pegar todos os times que um certo jogador é capitao
    setTeamsByCaptain([
      { name: "Fatec FC", id: 1 },
      { name: "Amigos do Levi", id: 2 },
    ]);
  };

  const handleGetWeekDaysToFilter = async (selectedCourt) => {
    const { data } = await api.get(
      `/api/jogador/quadras/${selectedCourt}/dias-bloqueados`
    );
    
    setWeekDaysToFilter(data.diasBloqueados);
  };

  const handleGetDisabledDates = async (selectedCourt,minDate,maxDate) => {
    //TODO requisição para retornar os dias sem agendamento disponível, ela deve retornar um array de varios Date
     const {data} = await api.get(`/api/jogador/quadras/${selectedCourt}/datas-indisponiveis/?inicio=${minDate}&fim=${maxDate}`)
     console.log(data);
    
     setDisabledDates(data)
    console.log(`court:${selectedCourt}, minDate:${minDate}, maxDate:${maxDate}`);
    
  };

  const handleGetAvaliableTimes = (selectedCourt, selectedDate) => {
    //TODO requisição para pegar os horarios de uma quadra determinada
    if (
      (selectedCourt == 1 && selectedDate != "24-05-2025") ||
      selectedDate == "24-05-2025"
    )
      setAvaliableTimes([
        "14:00-15:00",
        "15:00-16:00",
        "16:00-17:00",
        "17:00-18:00",
      ]);
    else if (selectedCourt == 2 || selectedDate == "20-05-2025")
      setAvaliableTimes(["18:00-19:00", "19:00-20:00", "20:00-21:00"]);
  };

  const handleGetInProgressChampionship = (playerId) => {
    //TODO Requisição para pegar os campeonatos em andamento que determinado jogador está participando
    setInProgressChampionship([
      {
        id: 1,
        initialDate: "01/02/2025",
        finalDate: "15/04/2025",
        subscribedTeam: "Fatec FC",
        image: "../../public/copa-fatec-icon.png",
        title: "COPA FATEC",
        altImage: "Logo COPA FATEC",
      },
      {
        id: 2,
        initialDate: "07/05/2025",
        finalDate: "15/08/2025",
        subscribedTeam: "Fatec FC",
        image: "../../public/copa-fatec-icon.png",
        title: "COPA PINHEIROS",
        altImage: "Logo COPA PINHEIROS",
      },
    ]);
  };

  const handleGetAvaliableChampionship = (playerId) => {
    //TODO Requisição para pegar os campeonatos que não foram iniciados e que o jogador não esta participando
    setAvaliableChampionship([
      {
        id: 3,
        initialDate: "01/02/2025",
        finalDate: "15/04/2025",
        premiation: "R$ 400,00",
        image: "../../public/copa-zn-icon.png",
        title: "COPA ZONA NORTE",
        altImage: "Logo COPA ZONA NORTE",
        registration: "R$40,00",
        description:
          "A Copa Zona Norte será um competição realizada em nossa quadra Amigos da Bola, " +
          "localizada na Av. Ipanema, 800. Os jogos do meio de semana serão realizados de noite já durante o fim de semana " +
          "serão na parte da manhã. Traga a família para acompanhar os jogos e desfrutar de nosso espaço!",
      },
      {
        id: 4,
        initialDate: "01/09/2025",
        finalDate: "15/10/2025",
        premiation: "R$ 900,00",
        image: "../../public/copa-zn-icon.png",
        title: "COPA ZONA LESTE",
        altImage: "Logo COPA ZONA LESTE",
        description:
          "A Copa Zona Leste será um competição realizada em nossa quadra Amigos da Bola, " +
          "localizada na Av. Ipanema, 800. Os jogos do meio de semana serão realizados de noite já durante o fim de semana " +
          "serão na parte da manhã. Traga a família para acompanhar os jogos e desfrutar de nosso espaço!",
      },
    ]);
  };
  const handleSetSelectedChamp = (champ) => {
    setSelectedChampionship(champ);
    localStorage.setItem("champ", JSON.stringify(champ));
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
        inProgressChampionship,
        avaliableChampionship,
        selectedChampionship,
        teamsByCaptain,
        handleLogin,
        handleLogOut,
        handleSingUp,
        handleEdit,
        handleGetNewInfos,
        handleGetCourt,
        handleGetWeekDaysToFilter,
        handleGetDisabledDates,
        handleGetAvaliableTimes,
        handleGetInProgressChampionship,
        handleGetAvaliableChampionship,
        handleSetSelectedChamp,
        handleGetTeamsByCaptain,
      }}
    >
      {children}
    </PlayerAuthContext.Provider>
  );
};
