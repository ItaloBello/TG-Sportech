import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayerLogin from "./pages/PlayerLogin";
import { PlayerSingUp } from "./pages/PlayerSingUp";
import PlayerRecovery from "./pages/PlayerRecovery";
import PlayerSms from "./pages/PlayerSms";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/player/login" element={<PlayerLogin />} />
          <Route path="/player/singup" element={<PlayerSingUp />} />
          <Route path="/player/recovery" element={<PlayerRecovery />} />
          <Route path="/player/recovery/sms" element={<PlayerSms />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

//rotas a definir:

//  player/menu
//  plaver/profile/:id
