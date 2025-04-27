import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayerLogin from "./pages/Player/Login";
import { PlayerSingUp } from "./pages/Player/SingUp";
import PlayerRecovery from "./pages/Player/Recovery";
import PlayerSms from "./pages/Player/Sms";
import PlayerMenu from "./pages/Player/Menu";
import TeamMenu from "./pages/Player/TeamMenu";
import CreateTeam from "./pages/Player/CreateTeam";
import JoinTeam from "./pages/Player/JoinTeam";
import PlayerProfile from "./pages/Player/Profile";
import ShowTeam from "./pages/Player/ShowTeam";
import EditTeam from "./pages/Player/EditTeam";
import ViewTeam from "./pages/Player/ViewTeam";
import PlayerChamp from "./pages/Player/ChampionshipMenu";
import SubscribeTeam from "./pages/Player/SubscribeTeam";
import { PlayerAuthContextProvider } from "./context/playerAuth";
import { AdminAuthContextProvider } from "./context/adminAuth";
import AdminLogin from "./pages/Admin/Login";
import AdminSingUp from "./pages/Admin/SingUp";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <PlayerAuthContextProvider>
          <AdminAuthContextProvider>
            <Routes>
              <Route path="/" element={<PlayerLogin />} />
              <Route path="/player/login" element={<PlayerLogin />} />
              <Route path="/player/singup" element={<PlayerSingUp />} />
              <Route path="/player/recovery" element={<PlayerRecovery />} />
              <Route path="/player/recovery/sms" element={<PlayerSms />} />
              <Route path="/player/menu" element={<PlayerMenu />} />
              <Route path="/player/profile/" element={<PlayerProfile />} />
              <Route path="/player/teammenu" element={<TeamMenu />} />
              <Route path="/player/createteam" element={<CreateTeam />} />
              <Route path="/player/jointeam" element={<JoinTeam />} />
              <Route path="/player/showteam" element={<ShowTeam />} />
              <Route path="/player/editteam" element={<EditTeam />} />
              <Route path="/player/viewteam" element={<ViewTeam />} />
              <Route path="/player/championship" element={<PlayerChamp />} />
              <Route path="/player/subscribeteam" element={<SubscribeTeam />} />

              {/* Rotas de admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/singup" element={<AdminSingUp />} />
            </Routes>
          </AdminAuthContextProvider>
        </PlayerAuthContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;

//rotas a definir:

//  plaver/profile/:id
