import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { notifySuccess, notifyError } from '../utils/notify';

export const PlayerAuthContext = createContext({});

export const PlayerAuthContextProvider = ({ children }) => {
  const [player, setPlayer] = useState({});
  const [error, setError] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedChampionship, setSelectedChampionship] = useState({});
  const [playoffsMatches, setPlayoffsMatches] = useState([]);
  const [champTablePoints, setChampTablePoints] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [myTeams, setMyTeams] = useState({});
  const [mySubscriptions, setMySubscriptions] = useState({});

  const [teamsByCaptain, setTeamsByCaptain] = useState([]);
  const [weekDaysToFilter, setWeekDaysToFilter] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [avaliableTimes, setAvaliableTimes] = useState([]);
  const [inProgressChampionship, setInProgressChampionship] = useState([]);
  const [avaliableChampionship, setAvaliableChampionship] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);

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
    
        navigate("/player/menu");
      } else {
        notifyError("email ou senha incorretos");
      }
    } catch (error) {
      notifyError(error.response?.data?.error || 'Erro ao realizar login.');
  
      setError(error.response?.data?.error || 'Erro ao realizar login.');
    }
  };

  //função de sing up
  const handleSingUp = async (formData) => {
    if (formData.password === formData.confirmPassword) {
      const {data} = await api.post("/api/jogador/registro", formData);
      console.log(data)
      navigate("/player/login");
    } else notifyError("As senhas estao diferentes");
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
    notifySuccess("Dados alterados com sucesso");
    navigate("player/menu");
  };

  const handleGetNewInfos = async () => {
    const { data } = await api.get(`api/jogador/info/${player.id}`);
    setPlayer(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const handleGetCourt = async () => {
    const { data } = await api.get("/api/jogador/quadras");
    setCourts(data);
  };

  const handleGetTeamsByCaptain = async (playerId) => {
    //TODO Requisição para pegar todos os times que um certo jogador é capitao
    const { data } = await api.get(`/api/jogador/times/${playerId}`);
    setTeamsByCaptain(data);
  };

  const handleGetWeekDaysToFilter = async (selectedCourt) => {
    const { data } = await api.get(
      `/api/jogador/quadras/${selectedCourt}/dias-bloqueados`
    );

    setWeekDaysToFilter(data.diasBloqueados);
  };

  const handleGetDisabledDates = async (selectedCourt, minDate, maxDate) => {
    const { data } = await api.get(
      `/api/jogador/quadras/${selectedCourt}/datas-indisponiveis/?inicio=${minDate}&fim=${maxDate}`
    );
    const newDate = data.datasIndisponiveis.map((date, index) => {
      return new Date(date);
    });

    setDisabledDates(newDate);
  };

  const handleGetAvaliableTimes = async (selectedCourt, selectedDate) => {
    const { data } = await api.get(
      `/api/jogador/quadras/horarios/${selectedCourt}?data=${selectedDate}`
    );

    setAvaliableTimes(data.slots);
  };

  const handleCreateAppointment = async (dataForm) => {
    try {
      // Garante que o id do jogador está presente
      const payload = {
        ...dataForm,
        playerId: dataForm.playerId || player.id
      };
      if (!payload.playerId) {
        notifyError('Erro: ID do jogador não encontrado. Faça login novamente.');
        return;
      }
      const response = await api.post("/api/jogador/agendar", payload);
      notifySuccess('Agendamento realizado com sucesso!');
      setTimeout(() => {
        navigate('player/scheduling')
      }, 3000)
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao criar agendamento.';
      notifyError(msg);
    }
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

  const handlePlayoffsGetChampMatches = async (champId) => {
    //TODO requisição que retorna os jogos marcados no playoffs, caso ainda não tenha algum jogo pronto, retorne o tipo, id, e o resto como arrays vazios, exemplo abaixo
    // {
    //     id:16,
    //     type: "final",
    //     names: [],
    //     points: [],
    //     images: [],
    //   }
    await setPlayoffsMatches([
      {
        id: 1,
        type: "oitavas",
        names: ["team1", "team2"],
        points: [1, 2],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 2,
        type: "oitavas",
        names: ["team3", "team4"],
        points: [4, 2],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 3,
        type: "oitavas",
        names: ["team5", "team6"],
        points: [1, 0],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 4,
        type: "oitavas",
        names: ["team7", "team8"],
        points: [1, 2],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 5,
        type: "oitavas",
        names: ["team9", "team10"],
        points: [0, 2],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 6,
        type: "oitavas",
        names: ["team11", "team12"],
        points: [4, 0],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 7,
        type: "oitavas",
        names: ["team13", "team14"],
        points: [3, 2],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 8,
        type: "oitavas",
        names: ["team15", "team16"],
        points: [1, 2],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 9,
        type: "quartas",
        names: ["team2", "team3"],
        points: [5, 2],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 10,
        type: "quartas",
        names: ["team5", "team8"],
        points: [1, 0],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 11,
        type: "quartas",
        names: ["team10", "team11"],
        points: [0, 2],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 12,
        type: "quartas",
        names: ["team13", "team16"],
        points: [1, 3],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 13,
        type: "semi",
        names: ["team2", "team5"],
        points: [1, 0],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 14,
        type: "semi",
        names: ["team11", "team16"],
        points: [4, 0],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
      {
        id: 15,
        type: "final",
        names: ["team2", "team11"],
        points: [4, 0],
        images: [
          "../../../public/team-1-icon.png",
          "../../../public/team-1-icon.png",
        ],
      },
    ]);
  };

  const handleGetChampPointsTable = async (champId) => {
    //TODO retornar cada linha da tabela de pontos do campeonato de pontos corridos, ordenado pela posição
    await setChampTablePoints([
      {
        position: 1,
        name: "Fatec Amigos",
        playedMatches: 8,
        victories: 5,
        draws: 2,
        defeats: 1,
        goalDifference: 9,
        points: 17,
      },
      {
        position: 2,
        name: "Sorocaba Team",
        playedMatches: 8,
        victories: 4,
        draws: 2,
        defeats: 2,
        goalDifference: 5,
        points: 14,
      },
      {
        position: 3,
        name: "Amigos do Levi",
        playedMatches: 8,
        victories: 3,
        draws: 2,
        defeats: 3,
        goalDifference: 2,
        points: 11,
      },
    ]);
  };

  const handleGetTopPlayersChamp = async (champId) => {
    //TODO requisição que retorna uma lista ordenada com os artilheiros e o numero de gols de um campeonato
    await setTopPlayers([
      {
        name: "Jefão",
        goals: 8,
      },
      {
        name: "Levi",
        goals: 7,
      },
      {
        name: "Dimas",
        goals: 6,
      },
    ]);
  };

  const handleGetMyAppointments = async () => {
    // Garante que player existe e tem id
    if (!player || !player.id) {
      setMyAppointments([]);
      return;
    }
    const {data} = await api.get(`/api/jogador/agendamentos/${player.id}`);
    setMyAppointments(data);
    console.log(data)
  };


  const handleGetMyTeams = async (playerId) => {
    const { data } = await api.get(`/api/jogador/times/${playerId}`);
    setMyTeams(data.times);
  };
  const handleGetMyTeamSubscriptions = async (playerId) => {
    const { data } = await api.get(`/api/jogador/times/subscription/${playerId}`);
    setMySubscriptions(data.times);
  };
  const handleCreateTeam = async (formData) => {
    try {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('primaryColor', formData.primaryColor);
    data.append('secondaryColor', formData.secondaryColor);
    data.append('userId', formData.userId);
  
    // Se o usuário escolheu uma imagem, adicione ao FormData
    if (formData.foto) {
      data.append('foto', formData.foto);
    }
  
    const {response} = await api.post(`/api/jogador/times`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.status === 200) {
      notifySuccess("Time criado com sucesso!")
    }
  }catch{
    notifyError("Erro ao criar time")
    }
  };

  const handleJoinTeam = async (formData) => {
    const {data} = await api.post(`/api/jogador/entrar/${formData.userId}`,{inviteCode: formData.inviteCode});
    notifySuccess(data)
  }

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
        playoffsMatches,
        champTablePoints,
        topPlayers,
        myAppointments,
        myTeams,
        mySubscriptions,
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
        handleCreateAppointment,
        handlePlayoffsGetChampMatches,
        handleGetChampPointsTable,
        handleGetTopPlayersChamp,
        handleGetMyAppointments,
        handleCreateTeam,
        handleJoinTeam,
        handleGetMyTeams,
        handleGetMyTeamSubscriptions
      }}
    >
      {children}
    </PlayerAuthContext.Provider>
  );
};
