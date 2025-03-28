import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayerLogin from "./pages/PlayerLogin";
import { PlayerSingUp } from "./pages/PlayerSingUp";
import PlayerRecovery from "./pages/PlayerRecovery";
import PlayerSms from "./pages/PlayerSms";
import PlayerMenu from "./pages/PlayerMenu";
import TeamMenu from "./pages/TeamMenu";
import CreateTeam from "./pages/CreateTeam";
import JoinTeam from "./pages/JoinTeam";
import PlayerProfile from "./pages/PlayerProfile";
import ShowTeam from "./pages/ShowTeam";
import EditTeam from "./pages/EditTeam";
import ViewTeam from "./pages/ViewTeam";
import PlayerChamp from "./pages/PlayerChamp";
const App = () => {
  return (
    <>
      <BrowserRouter>
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
          <Route path="/player/editteam" element={<EditTeam/>}/>
          <Route path="/player/viewteam" element={<ViewTeam/>}/>
          <Route path="/player/championship" element={<PlayerChamp/>}/>
v        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

//rotas a definir:


//  plaver/profile/:id
