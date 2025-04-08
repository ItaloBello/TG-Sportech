import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export const AdminAuthContext = createContext({});

export const AdminAuthContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();

  //login
  const handleLogin = async (formData) => {
    try {
      const { data } = await api.get(
        `/api/admin/login?name=${formData.name}&password=${formData.password}`
      );
      if (data.id) {
        setAdmin(data.id);
        navigate("/admin/menu");
      } else {
        alert("ERRO: email ou senha incorretos");
      }
    } catch (error) {
      alert("houve um erro, tente novamente");
      console.log(error);
    }
  };

  //singup
  const handleSingUp = (formData) => {
    if(formData.password === formData.confirmPassword){
        api.post(`/api/admin/registro`, formData)
        navigate('/admin/menu')
    }else{
        alert("ERRO: senhas incompativeis");
    }
  }

  //logout
  const handleLogOut = ()=>{
    setAdmin({})
    navigate(`/admin/login`)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, handleLogin, handleSingUp }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
