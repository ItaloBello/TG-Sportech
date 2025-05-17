import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayerLogin from "./pages/Player/Login";
import { PlayerSingUp } from "./pages/Player/SingUp";
import PlayerRecovery from "./pages/Player/Recovery";
import PlayerEmail from "./pages/Player/Email";
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
import PlayoffsCreateChampionship from "./pages/Admin/PlayoffsCreateChampionship";
import SchedulingMenu from "./pages/Player/SchedulingMenu";
import SchedulingSimple from "./pages/Player/SchedulingSimple";
import CreateChampionshipMenu from "./pages/Admin/CreateChampionshipMenu";
import PointsCreateChampionship from "./pages/Admin/PointsCreateChampionship";
import RegisterEstab from "./pages/Admin/RegisterEstab";
import MyAppointments from "./pages/Player/MyAppointments";
import ChooseTeam from "./pages/Player/ChooseTeam";
import ChampionshipProgressPlayoffs from "./pages/Player/ChampionshipProgressPlayoffs";

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
              <Route path="/player/recovery/email" element={<PlayerEmail />} />
              <Route path="/player/menu" element={<PlayerMenu />} />
              <Route path="/player/profile/" element={<PlayerProfile />} />
              <Route path="/player/team-menu" element={<TeamMenu />} />
              <Route path="/player/create-team" element={<CreateTeam />} />
              <Route path="/player/join-team" element={<JoinTeam />} />
              <Route path="/player/show-team" element={<ShowTeam />} />
              <Route path="/player/edit-team" element={<EditTeam />} />
              <Route path="/player/view-team" element={<ViewTeam />} />
              <Route path="/player/championship" element={<PlayerChamp />} />
              <Route path="/player/championship-progress" element={<ChampionshipProgressPlayoffs />} />
              <Route path="/player/subscribe-team" element={<SubscribeTeam />} />
              <Route path="/player/choose-team" element={<ChooseTeam />} />
              <Route path="/player/scheduling" element={<SchedulingMenu />} />
              <Route path="/player/scheduling-simple" element={<SchedulingSimple />} />
              <Route path="/player/my-appointments" element={<MyAppointments />} />

              {/* Rotas de admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/singup" element={<AdminSingUp />} />
              <Route path="/admin/register-establishment" element={<RegisterEstab />} />
              <Route path="/admin/welcome" element={<Welcome/>}/>
              <Route path="/admin/create-court" element={<CreateCourt/>}/>
              <Route path="/admin/menu" element={<AdminMenu/>}/>
              <Route path="/admin/court-menu" element={<CourtMenu/>}/>
              <Route path="/admin/championship-menu" element={<ChampionshipMenu/>}/>
              <Route path="/admin/create-championship/menu" element={<CreateChampionshipMenu/>}/>
              <Route path="/admin/create-championship/playoffs" element={<PlayoffsCreateChampionship/>}/>
              <Route path="/admin/create-championship/points" element={<PointsCreateChampionship/>}/>
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
