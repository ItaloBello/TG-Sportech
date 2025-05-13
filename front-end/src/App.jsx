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
import Home from "./pages/Home";
import Welcome from "./pages/Admin/Welcome";
import CreateCourt from "./pages/Admin/CreateCourt";
import AdminMenu from './pages/Admin/Menu'
import CourtMenu from "./pages/Admin/CourtMenu";
import ChampionshipMenu from "./pages/Admin/ChampionshipMenu";
import CreateChampionship from "./pages/Admin/CreateChampionship";
import SchedulingMenu from "./pages/Player/SchedulingMenu";
import SchedulingSimple from "./pages/Player/SchedulingSimple";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <PlayerAuthContextProvider>
          <AdminAuthContextProvider>
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Rotas de Jogador */}
              <Route path="/player/login" element={<PlayerLogin />} />
              <Route path="/player/singup" element={<PlayerSingUp />} />
              <Route path="/player/recovery" element={<PlayerRecovery />} />
              <Route path="/player/recovery/sms" element={<PlayerSms />} />
              <Route path="/player/menu" element={<PlayerMenu />} />
              <Route path="/player/profile/" element={<PlayerProfile />} />
              <Route path="/player/team-menu" element={<TeamMenu />} />
              <Route path="/player/create-team" element={<CreateTeam />} />
              <Route path="/player/join-team" element={<JoinTeam />} />
              <Route path="/player/show-team" element={<ShowTeam />} />
              <Route path="/player/edit-team" element={<EditTeam />} />
              <Route path="/player/view-team" element={<ViewTeam />} />
              <Route path="/player/championship" element={<PlayerChamp />} />
              <Route path="/player/subscribe-team" element={<SubscribeTeam />} />
              <Route path="/player/scheduling" element={<SchedulingMenu />} />
              <Route path="/player/scheduling-simple" element={<SchedulingSimple />} />

              {/* Rotas de admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/singup" element={<AdminSingUp />} />
              <Route path="/admin/welcome" element={<Welcome/>}/>
              <Route path="/admin/create-court" element={<CreateCourt/>}/>
              <Route path="/admin/menu" element={<AdminMenu/>}/>
              <Route path="/admin/court-menu" element={<CourtMenu/>}/>
              <Route path="/admin/championship-menu" element={<ChampionshipMenu/>}/>
              <Route path="/admin/create-championship" element={<CreateChampionship/>}/>
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
