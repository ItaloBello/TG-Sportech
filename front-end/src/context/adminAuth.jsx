import { createContext, useEffect, useState, useCallback } from "react";
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
  const [court, setCourt] = useState(null); // Initialize court state to null
  const [selectedCourt, setSelectedCourt] = useState(null); // Initialize selectedCourt to null
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(() => {
    const saved = localStorage.getItem('selectedAppointment');
    return saved ? JSON.parse(saved) : undefined;
  });
  const [selectedType, setSelectedType] = useState({})
  const [teamNumber, setTeamNumber] = useState(0)
  const[avaliableTimes, setAvaliableTimes] = useState()
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
    const { data } = await api.get(`/api/admin/quadras/${adminId}`);
    setMyCourts(data);
    console.log(data)
  };

  const handleGetAppointmens = async (adminId) => {
    try {
      const res = await api.get(`/api/admin/quadras/ids/${adminId}`);
      console.log('Quadras response:', res);
      console.log('res.data:', res.data);
      const courts = Array.isArray(res.data) ? res.data : [];
      console.log('Courts:', courts);
      console.log('AdminId:', adminId);
  
      if (courts.length === 0) {
        setAppointments([]);
        console.log('No courts found for admin or backend returned error:', res.data);
        return;
      }

      const appointmentsRes = await api.get(
        `/api/admin/agendamentos?quadras=${courts.join(",")}`
      );
      setAppointments(appointmentsRes.data);
      console.log('Appointments:', appointmentsRes.data);
    } catch (error) {
      console.error('Error in handleGetAppointmens:', error);
    }
  };

  const handleGetAvaliableTimes = async (selectedCourt, selectedDate) => {
    const { data } = await api.get(
      `/api/jogador/quadras/horarios/${selectedCourt}?data=${selectedDate}`
    );
    console.log(data);
    setAvaliableTimes(data.slots); // Keep for other potential consumers
    return data.slots; // Return the slots
  };

  const handleGetCourt = useCallback(async (courtId) => {
    try {
      const { data } = await api.get(`/api/admin/quadra/${courtId}`); 
      setCourt(data); 
      return data;    
    } catch (error) {
      console.error("Error fetching court details:", error);
      notifyError(error.response?.data?.message || 'Erro ao buscar detalhes da quadra.');
      setCourt(null); 
      return null;
    }
  }, [api, setCourt, notifyError]);

  const handleSetSelectedCourt = (courtId) => {
    setSelectedCourt(courtId);
    //localStorage
  };

  const handleSetSelectedAppointment = (appointmentId)=>{
    setSelectedAppointment(appointmentId)
    //localStorage
  }

  const handleGetTeamNumber = (champId) =>{
    setTeamNumber(16)
  }

  const handleSetSelectedChamp = (champId) => {
    //TODO retornar os dados do campeonato
    // const {data} = getChamp(champId)
    setSelectedChamp({
      id: 1,
    });
    localStorage.setItem("championship", JSON.stringify(selectedChamp));
  };

  const handleSelectedType = async (appointmentId) => {
    try {
      const { data } = await api.get(`/api/admin/agendamentos/type/${appointmentId}`);
      setSelectedType(data); // Assuming data is the type or an object containing it
      return data; // Return data for the .then() in EditAppointment
    } catch (error) {
      console.error("Error fetching appointment type:", error);
      notifyError(error.response?.data?.message || 'Erro ao buscar tipo de agendamento.');
      return null; 
    }
  };

  const handleEditCourt = useCallback(async (payload) => {
    try {
      // The payload should contain the court's id as payload.id
      const { data } = await api.put(`/api/admin/atualizarQuadra/${payload.id}`, payload);
      notifySuccess('Quadra atualizada com sucesso!');
      // Optionally, you might want to re-fetch the court list or navigate the user
      // For example, navigate back to a court listing page:
      // navigate('/admin/my-courts'); // (Adjust route as needed)
      return data;
    } catch (error) {
      console.error("Error updating court:", error);
      notifyError(error.response?.data?.message || 'Erro ao atualizar quadra.');
      return null;
    }
  }, [api, notifySuccess, notifyError]);

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
        avaliableTimes,
        handleLogin,
        handleSingUp,
        handleLogOut,
        handleCreateCourt,
        handleGetNotStartedChamp,
        handleGetInProgressChamp,
        handleGetChampMatches,
        handleGetMyCourts,
        handleGetAvaliableTimes, // Added this function to the context
        handleGetCourt,
        handleSetSelectedCourt,
        handleGetAppointmens,
        handleSetSelectedAppointment,
        handleGetTeamNumber,
        handleSetSelectedChamp,
        handleSelectedType,
        handleEditCourt
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
