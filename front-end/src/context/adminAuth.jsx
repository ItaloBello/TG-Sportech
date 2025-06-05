import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { notifySuccess, notifyError } from '../utils/notify';
export const AdminAuthContext = createContext({});

export const AdminAuthContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState({});
  const [notStartedChamp, setNotStartedChamp] = useState([]);
  const [inProgressChamp, setInProgressChamp] = useState([]);
  const [selectedChamp, setSelectedChamp] = useState({});
  const [champMatches, setChampMatches] = useState([]);
  const [myCourts, setMyCourts] = useState([]);
  const [court, setCourt] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(() => {
    const saved = localStorage.getItem('selectedAppointment');
    return saved ? JSON.parse(saved) : undefined;
  });
  const [selectedType, setSelectedType] = useState({})
  const [teamNumber, setTeamNumber] = useState(0)

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
  
        navigate("/admin/menu");
      } else {
        notifyError("ERRO: email ou senha incorretos");
      }
    } catch (error) {
      notifyError(error.response?.data?.error || 'Erro ao realizar login.');
  
    }
  };

  //singup
  const handleSingUp = async (formData) => {
    if (formData.password === formData.confirmPassword) {
      const response = await api.post(`/api/admin/registro`, formData);
  
      if (response.status == 201) {
        const payload = {
          ...formData,
          name: formData.email,
        };
        handleLogin(payload);
        navigate("/admin/menu");
      } else notifyError('Erro ao cadastrar.');
    } else {
      notifyError("ERRO: senhas incompativeis");
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
  
    if (data.id) {
      setPlayer(data);
      localStorage.setItem("user", JSON.stringify(data));
    }
  };

  const handleCreateCourt = (dataForm) => {
    const response = api.post(
      `/api/admin/cadastrarQuadra/${dataForm.id}`,
      dataForm
    );
  };

  const handleGetNotStartedChamp = (adminId) => {
    setNotStartedChamp([
      {
        name: "COPA FATEC",
        id: 1,
      },
      {
        name: "COPA ZONA LESTE",
        id: 2,
      },
    ]);
  };
  const handleGetInProgressChamp = (adminId) => {
    setInProgressChamp([
      {
        name: "COPA ZONA NORTE",
        id: 3,
      },
      {
        name: "COPA PINHEIROS",
        id: 4,
      },
    ]);
  };
  const handleGetChampMatches = (champId) => {
    setChampMatches([
      {
        title: "oitavas",
        date: "12/02/2000",
        teams: ["Fatec FC", "Amigos Fatec"],
        points: [3, 2],
      },
      {
        title: "oitavas",
        date: "12/02/2020",
        teams: ["Fatec FC", "Amigos Fatec"],
        points: [1, 7],
      },
    ]);
  };

  const handleGetMyCourts = async (adminId) => {
    try {
      const { data } = await api.get(`/api/admin/quadras/${adminId}`);
      setMyCourts(data);
    } catch (error) {
      notifyError('Erro ao buscar quadras.');
    }
  };

  const handleGetAppointmens = async (adminId) => {
    try {
      const res = await api.get(`/api/admin/quadras/ids/${adminId}`);
      const courts = Array.isArray(res.data) ? res.data : [];
      if (courts.length === 0) {
        setAppointments([]);
        notifyError('Nenhuma quadra encontrada para o admin ou erro no backend.');
        return;
      }

      const appointmentsRes = await api.get(`/api/admin/agendamentos?quadras=${courts.join(',')}`);
      setAppointments(appointmentsRes.data);
  
    } catch (error) {
      notifyError('Erro ao buscar agendamentos.');
    }
  };
  const handleSetSelectedCourt = (courtId) => {
    setSelectedCourt(courtId);
    //localStorage
  };

  const handleSetSelectedAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    localStorage.setItem('selectedAppointment', JSON.stringify(appointment));
  }

  const handleSelectedType = async (appointmentId) => {
    try {
      const { data } = await api.get(`/api/admin/agendamentos/type/${appointmentId}`);
      setSelectedType(data.type);
      return data;
    } catch (error) {
      notifyError('Erro ao buscar tipo de agendamento.');
    }
  }

  const handleGetTeamNumber = (champId) =>{
    setTeamNumber(16)
  }

  const handleGetCourt = async (courtId) => {
    try {
      const {data} = await api.get(`/api/admin/quadra/${courtId}`)
      setCourt(data)
    } catch (error) {
      notifyError('Erro ao buscar quadra.');
    }
  }

  const handleEditCourt = async (formData) => {
    try {
      const {data} = await api.put(`/api/admin/atualizarQuadra/${formData.id}`, formData)  
      notifySuccess(data.message || 'Quadra atualizada com sucesso!');
      setTimeout(() => {
        navigate('/admin/select-court')
      }, 3000);
    } catch (error) {
      notifyError(error.response?.data?.error || 'Ocorreu um erro ao atualizar a quadra.');
    }
  }

  const handleSetSelectedChamp = (champId)=>{
    //TODO retornar os dados do campeonato 
    // const {data} = getChamp(champId)
    setSelectedChamp({
      id:1
    })
    localStorage.setItem('championship',JSON.stringify(selectedChamp))
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        notStartedChamp,
        inProgressChamp,
        selectedChamp,
        champMatches,
        myCourts,
        court,
        selectedCourt,
        appointments,
        selectedAppointment,
        selectedType,
        teamNumber,
        handleLogin,
        handleSingUp,
        handleLogOut,
        handleCreateCourt,
        handleGetNotStartedChamp,
        handleGetInProgressChamp,
        handleGetChampMatches,
        handleGetMyCourts,
        handleGetCourt,
        handleSetSelectedCourt,
        handleGetAppointmens,
        handleSetSelectedAppointment,
        handleGetTeamNumber,
        handleSetSelectedChamp,
        handleSelectedType,
        handleEditCourt,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
