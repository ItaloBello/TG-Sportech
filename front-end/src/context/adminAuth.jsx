import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const AdminAuthContext = createContext({});

export const AdminAuthContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState({});
  const [notStartedChamp, setNotStartedChamp] = useState([]);
  const [inProgressChamp, setInProgressChamp] = useState([]);
  const [selectedChamp, setSelectedChamp] = useState({});
  const [champMatches, setChampMatches] = useState([]);
  const [myCourts, setMyCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState([]);
  const [appointments, setAppointments] = useState([]);

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
        console.log(localStorage.getItem("user"));
        navigate("/admin/menu");
      } else {
        alert("ERRO: email ou senha incorretos");
      }
    } catch (error) {
      alert(error.response.data.error);
      console.log(error.response.data.error);
    }
  };

  //singup
  const handleSingUp = async (formData) => {
    if (formData.password === formData.confirmPassword) {
      const response = await api.post(`/api/admin/registro`, formData);
      console.log(response.status);
      if (response.status == 201) {
        const payload = {
          ...formData,
          name: formData.email,
        };
        handleLogin(payload);
        navigate("/admin/menu");
      } else console.log(response);
    } else {
      alert("ERRO: senhas incompativeis");
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
    console.log(data);
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
    await setMyCourts([
      {
        id: 1,
        name: "quadra cabecinha",
      },
      {
        id: 2,
        name: "quadra jubileu",
      },
    ]);
  };

  const handleGetAppointmens = (adminId) => {
    setAppointments([
      {
        date: "01/01/2000",
        status: "Pagamento Pendente",
        times: ["19:00-20:00"],
        type: "Rachão",
        court: "quadra cabecinha",
      },
      {
        date: "07/09/2020",
        status: "Pagamento Pendente",
        times: ["19:00-20:00",'20:00-21:00'],
        type: "Rachão",
        court: "quadra cabecinha",
        adversary: 'Amigos do Levi'
      },
    ]);
  };

  const handleSetSelectedCourt = (courtId) => {
    setSelectedCourt(courtId);
  };
  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        notStartedChamp,
        inProgressChamp,
        selectedChamp,
        champMatches,
        myCourts,
        selectedCourt,
        appointments,
        handleLogin,
        handleSingUp,
        handleLogOut,
        handleCreateCourt,
        handleGetNotStartedChamp,
        handleGetInProgressChamp,
        handleGetChampMatches,
        handleGetMyCourts,
        handleSetSelectedCourt,
        handleGetAppointmens
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
