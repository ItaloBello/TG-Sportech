import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { notifySuccess, notifyError } from '../utils/notify';

export const PlayerAuthContext = createContext({});

export const PlayerAuthContextProvider = ({ children }) => {
  const [player, setPlayer] = useState({});
  const [error, setError] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedChampionship, setSelectedChampionship] = useState(null);
  const [playoffsMatches, setPlayoffsMatches] = useState([]);
  const [teamsByCaptain, setTeamsByCaptain] = useState([]);
  const [champTablePoints, setChampTablePoints] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [myTeams, setMyTeams] = useState({});
  const [mySubscriptions, setMySubscriptions] = useState({});

  const [weekDaysToFilter, setWeekDaysToFilter] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [avaliableTimes, setAvaliableTimes] = useState([]);
  const [inProgressChampionship, setInProgressChampionship] = useState([]);
  const [avaliableChampionship, setAvaliableChampionship] = useState([]);
  const [finishedChampionships, setFinishedChampionships] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [amistososPendentes, setAmistososPendentes] = useState([]);
  const [amistososTime, setAmistososTime] = useState([]);

  const navigate = useNavigate();

  const handlePlayoffsGetChampInfo = async (champId) => {
    try {
      const response = await api.get(`/api/campeonato/${champId}`);
      // Assuming the backend returns { campeonato: {...}, timesInscritos: [...], partidas: [...] }
      // Or just the championship object directly if it's a simpler endpoint for info only
      const champData = response.data.campeonato || response.data; 
      setSelectedChampionship(champData);
      localStorage.setItem("champ", JSON.stringify(champData));
      return champData;
    } catch (error) {
      console.error("Erro ao buscar informações do campeonato:", error);
      notifyError(error.response?.data?.error || 'Erro ao buscar informações do campeonato.');
      return null;
    }
  };

  const handlePlayoffsGetChampTeams = async (champId) => {
    try {
      const response = await api.get(`/api/campeonato/${champId}`);
      // Assuming the backend returns { campeonato: {...}, timesInscritos: [...], partidas: [...] }
      return response.data.timesInscritos || [];
    } catch (error) {
      console.error("Erro ao buscar times do campeonato:", error);
      notifyError(error.response?.data?.error || 'Erro ao buscar times do campeonato.');
      return [];
    }
  };

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

  const handleGetFinishedChampionships = async () => {
    try {
      // Buscar todos os campeonatos concluídos
      const response = await api.get('/api/campeonato/status/concluidos');
      const campeonatos = response.data;
      
      // Formatar os dados para o formato esperado pelo frontend
      const formattedChampionships = campeonatos.map(campeonato => ({
        id: campeonato.id,
        initialDate: new Date(campeonato.initialDate).toLocaleDateString('pt-BR'),
        finalDate: '', // Não temos data de fim no modelo atual
        image: campeonato.image || "/default-campeonato.png",
        title: campeonato.title,
        altImage: `Logo ${campeonato.title}`,
        status: campeonato.status,
        description: campeonato.description,
        court: campeonato.court,
        premiation: campeonato.premiation
      }));
      
      setFinishedChampionships(formattedChampionships);
    } catch (error) {
      console.error('Erro ao buscar campeonatos concluídos:', error);
      setFinishedChampionships([]);
    }
  };

  const handleGetInProgressChampionship = async () => {
    try {
      // Buscar todos os campeonatos em andamento
      const response = await api.get('/api/campeonato/status/em-andamento');
      const campeonatos = response.data;
      
      // Formatar os dados para o formato esperado pelo frontend
      const formattedChampionships = campeonatos.map(campeonato => ({
        id: campeonato.id,
        initialDate: new Date(campeonato.initialDate).toLocaleDateString('pt-BR'),
        finalDate: '', // Não temos data de fim no modelo atual
        subscribedTeam: '', // Será preenchido depois
        image: campeonato.image || "/default-campeonato.png",
        title: campeonato.title,
        altImage: `Logo ${campeonato.title}`,
        status: campeonato.status,
        description: campeonato.description,
        court: campeonato.court
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
      console.log('LOG: campeonatosDisponiveis BRUTO da API:', campeonatosDisponiveis);
      
      if (!campeonatosDisponiveis || campeonatosDisponiveis.length === 0) {
        setAvaliableChampionship([]);
        return;
      }
      
      // Usar diretamente todos os campeonatos disponíveis, sem filtrar por inscrições existentes
      setAvaliableChampionship(campeonatosDisponiveis);
      console.log('CONTEXTO: Campeonatos disponíveis definidos:', campeonatosDisponiveis);
    } catch (error) {
      console.error('Erro ao buscar campeonatos disponíveis:', error);
      setAvaliableChampionship([]);
    }
  };
  const handleSetSelectedChamp = (champ) => {
    setSelectedChampionship(champ);
    localStorage.setItem("champ", JSON.stringify(champ));
  };

  const getPhaseType = (fase) => {
    switch (fase) {
      case 1: return 'oitavas';
      case 2: return 'quartas';
      case 3: return 'semi';
      case 4: return 'final';
      default: return 'oitavas';
    }
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
    try {
      const response = await api.get(`/api/campeonato/${champId}/partidas`);
      const matches = response.data.map(partida => ({
        id: partida.id,
        type: getPhaseType(partida.fase), // Assuming getPhaseType translates fase to 'oitavas', 'quartas', etc.
        names: [partida.timeA?.nome || 'A definir', partida.timeB?.nome || 'A definir'],
        points: [partida.gols_time_a, partida.gols_time_b],
        // IMPORTANT: Assuming the backend response for a match includes team objects with an 'img' property
        images: [partida.timeA?.img || '/default-team-icon.png', partida.timeB?.img || '/default-team-icon.png']
      }));
      setPlayoffsMatches(matches);
      return matches;
    } catch (error) {
      console.error("Erro ao buscar partidas do campeonato:", error);
      notifyError(error.response?.data?.error || 'Erro ao buscar partidas do campeonato.');
      setPlayoffsMatches([]); // Clear matches on error
      return [];
    }
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
        finishedChampionships,
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
        handleGetFinishedChampionships,
        handleSetSelectedChamp,
        handlePlayoffsGetChampInfo, // Added
        handlePlayoffsGetChampMatches,
        handlePlayoffsGetChampTeams, // Added
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
