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
  const [amistososPendentes, setAmistososPendentes] = useState([]);
  const [amistososTime, setAmistososTime] = useState([]);

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

  const handleGetInProgressChampionship = async (playerId) => {
    try {
      // Buscar os times do jogador
      const teamsResponse = await api.get(`/api/jogador/times`);
      const teams = teamsResponse.data;
      
      if (!teams || teams.length === 0) {
        setInProgressChampionship([]);
        return;
      }
      
      // Para cada time, buscar os campeonatos em que está inscrito
      const inscricoes = [];
      
      for (const team of teams) {
        const response = await api.get(`/api/campeonato/time/${team.id}`);
        if (response.data && response.data.length > 0) {
          // Filtrar apenas campeonatos em andamento
          const emAndamento = response.data.filter(inscricao => 
            inscricao.Campeonato && inscricao.Campeonato.status === 'em andamento'
          );
          
          inscricoes.push(...emAndamento);
        }
      }
      
      // Formatar os dados para o formato esperado pelo frontend
      const formattedChampionships = inscricoes.map(inscricao => ({
        id: inscricao.Campeonato.id,
        initialDate: new Date(inscricao.Campeonato.data_inicio).toLocaleDateString('pt-BR'),
        finalDate: '', // Não temos data de fim no modelo atual
        subscribedTeam: inscricao.Time ? inscricao.Time.name : '',
        image: "../../public/copa-fatec-icon.png", // Imagem padrão
        title: inscricao.Campeonato.nome,
        altImage: `Logo ${inscricao.Campeonato.nome}`,
      }));
      
      setInProgressChampionship(formattedChampionships);
    } catch (error) {
      console.error('Erro ao buscar campeonatos em andamento:', error);
      setInProgressChampionship([]);
    }
  };

  const handleGetAvaliableChampionship = async (playerId) => {
    try {
      // Buscar todos os campeonatos disponíveis para inscrição
      const response = await api.get('/api/campeonato/disponiveis');
      const campeonatosDisponiveis = response.data;
      
      if (!campeonatosDisponiveis || campeonatosDisponiveis.length === 0) {
        setAvaliableChampionship([]);
        return;
      }
      
      // Buscar os times do jogador
      const teamsResponse = await api.get(`/api/jogador/times`);
      const teams = teamsResponse.data;
      
      // Para cada time, buscar os campeonatos em que já está inscrito para filtrar
      const inscricoesExistentes = new Set();
      
      if (teams && teams.length > 0) {
        for (const team of teams) {
          const inscricoesResponse = await api.get(`/api/campeonato/time/${team.id}`);
          if (inscricoesResponse.data && inscricoesResponse.data.length > 0) {
            inscricoesResponse.data.forEach(inscricao => {
              inscricoesExistentes.add(inscricao.campeonatoId);
            });
          }
        }
      }
      
      // Filtrar apenas campeonatos em que o jogador não está inscrito
      const campeonatosNaoInscritos = campeonatosDisponiveis.filter(
        campeonato => !inscricoesExistentes.has(campeonato.id)
      );
      
      // Formatar os dados para o formato esperado pelo frontend
      const formattedChampionships = campeonatosNaoInscritos.map(campeonato => ({
        id: campeonato.id,
        initialDate: new Date(campeonato.data_inicio).toLocaleDateString('pt-BR'),
        finalDate: '', // Não temos data de fim no modelo atual
        premiation: `R$ ${Number(campeonato.premiacao).toFixed(2)}`,
        image: "../../public/copa-zn-icon.png", // Imagem padrão
        title: campeonato.nome,
        altImage: `Logo ${campeonato.nome}`,
        registration: `R$ ${Number(campeonato.registro).toFixed(2)}`,
        description: campeonato.descricao,
      }));
      
      setAvaliableChampionship(formattedChampionships);
    } catch (error) {
      console.error('Erro ao buscar campeonatos disponíveis:', error);
      setAvaliableChampionship([]);
    }
  };
  const handleSetSelectedChamp = (champ) => {
    setSelectedChampionship(champ);
    localStorage.setItem("champ", JSON.stringify(champ));
  };

  // Função para inscrever um time em um campeonato
  const handleSubscribeTeamToChampionship = async (timeId, campeonatoId) => {
    try {
      const response = await api.post('/api/campeonato/inscrever', {
        timeId,
        campeonatoId
      });
      
      // Atualizar as listas de campeonatos após a inscrição
      handleGetAvaliableChampionship();
      handleGetInProgressChampionship();
      
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Erro ao inscrever time no campeonato:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Erro ao inscrever time no campeonato' 
      };
    }
  };
    
  // Buscar amistosos pendentes para um time
  const handleGetPendingAmistosos = async (timeId) => {
    try {
      const response = await api.get(`/api/amistoso/pendentes/${timeId}`);
      setAmistososPendentes(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar amistosos pendentes:', error);
      return [];
    }
  };
  
  // Buscar todos os amistosos de um time
  const handleGetTeamAmistosos = async (timeId) => {
    try {
      const response = await api.get(`/api/amistoso/time/${timeId}`);
      setAmistososTime(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar amistosos do time:', error);
      return [];
    }
  };
  
  // Criar um desafio de amistoso
  const handleCreateAmistoso = async (data) => {
    try {
      const response = await api.post('/api/amistoso/desafiar', data);
      handleGetTeamAmistosos(data.timeDesafianteId);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Erro ao criar desafio de amistoso:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Erro ao criar desafio de amistoso' 
      };
    }
  };
  
  // Responder a um desafio de amistoso
  const handleRespondAmistoso = async (amistosoId, resposta) => {
    try {
      const response = await api.put(`/api/amistoso/${amistosoId}/responder`, { resposta });
      handleGetPendingAmistosos();
      handleGetTeamAmistosos();
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Erro ao responder desafio de amistoso:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Erro ao responder ao desafio' 
      };
    }
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
      const dataPayload = new FormData();
      dataPayload.append('name', formData.name);
      dataPayload.append('primaryColor', formData.primaryColor);
      dataPayload.append('secondaryColor', formData.secondaryColor);
      dataPayload.append('userId', formData.userId);
    
      // Se o usuário escolheu uma imagem, adicione ao FormData
      if (formData.foto) {
        dataPayload.append('foto', formData.foto);
      }
    
      const response = await api.post(`/api/jogador/times`, dataPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Resposta da API ao criar time:', response);

      if (response.status === 201) {
        notifySuccess("Time criado com sucesso!");
        setTimeout(() => {
          navigate("/player/team-menu")
        }, 3000)
      } else {
        notifyError(response.data?.error || `Falha ao criar time (Status: ${response.status})`);
      }
    } catch (error) {
      console.error('Erro ao criar time:', error);
      notifyError(error.response?.data?.error || error.message || "Erro desconhecido ao criar o time.");
    }
  };

  const handleJoinTeam = async (formData) => {
    try{
    const {data} = await api.post(`/api/jogador/entrar/${formData.userId}`,{inviteCode: formData.inviteCode});
    notifySuccess(data.message)
    setTimeout(() => {
      navigate("/player/team-menu")
    }, 3000)
  }catch(error){
    notifyError(error.response?.data?.error || error.message || "Erro desconhecido ao entrar no time.")
  }
  }

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [isTeamOwner, setIsTeamOwner] = useState(false);

  const handleGetTeamDetails = async (teamId) => {
    try {
      const { data } = await api.get(`/api/jogador/time/${teamId}?userId=${player.id}`);
      setSelectedTeam(data.time);
      setTeamPlayers(data.jogadores);
      setIsTeamOwner(data.isOwner);
      return data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do time:', error);
      notifyError(error.response?.data?.error || 'Erro ao carregar detalhes do time');
      return null;
    }
  };

  const handleRemovePlayerFromTeam = async (teamId, playerId) => {
    try {
      await api.delete('/api/jogador/remover', { 
        data: { timeId: teamId, jogadorId: playerId } 
      });
      notifySuccess('Jogador removido do time com sucesso!');
      // Atualiza a lista de jogadores
      handleGetTeamDetails(teamId);
    } catch (error) {
      notifyError(error.response?.data?.error || 'Erro ao remover jogador do time');
    }
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
        myAppointments,
        myTeams,
        mySubscriptions,
        selectedTeam,
        teamPlayers,
        isTeamOwner,
        amistososPendentes,
        amistososTime,
        playoffsMatches,
        champTablePoints,
        topPlayers,
        // Funções de autenticação
        handleLogin,
        handleSingUp,
        handleLogOut,
        handleEdit,
        handleGetNewInfos,
        // Funções de times
        handleGetCourt,
        handleGetTeamsByCaptain,
        handleGetTeamDetails,
        handleCreateTeam,
        handleJoinTeam,
        handleRemovePlayerFromTeam,
        handleGetMyAppointments,
        handleGetMyTeams,
        handleGetMyTeamSubscriptions,
        // Funções de campeonatos
        handleGetInProgressChampionship,
        handleGetAvaliableChampionship,
        handleSetSelectedChamp,
        handlePlayoffsGetChampMatches,
        handleGetChampPointsTable,
        handleGetTopPlayersChamp,
        handleSubscribeTeamToChampionship,
        // Funções de amistosos
        handleGetPendingAmistosos,
        handleGetTeamAmistosos,
        handleCreateAmistoso,
        handleRespondAmistoso,
        // Funções de agendamento
        handleGetWeekDaysToFilter,
        handleGetDisabledDates,
        handleGetAvaliableTimes,
        handleCreateAppointment
      }}
    >
      {children}
    </PlayerAuthContext.Provider>
  );
};
