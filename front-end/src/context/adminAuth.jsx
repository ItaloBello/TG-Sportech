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
      //const {data} = await api.get(`/admin?name=${formData.name}&password=${formData.password}`)
      if (data.id) {
        setAdmin(data.id);
        navigate("/admin/menu");
      } else {
        alert("ERRO: email ou senha incorretos");
      }
    } catch (error) {
      alert(error.response.data.error);
      console.log(error.response.data.error)
    }
  };

  //singup
  const handleSingUp = async (formData) => {
    if(formData.password === formData.confirmPassword){
        const response = await api.post(`/api/admin/registro`, formData)
        //api.post(`/admin`,formData)
        if(response.status == 200)
          navigate('/admin/login')
        else
          console.log(response)
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
    <AdminAuthContext.Provider value={{ admin, handleLogin, handleSingUp, handleLogOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
