import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { useState } from "react";
import ProfileUpdate from "./components/ProfileUpdate";
import NavigationBar from "./components/NavigationBar";
import AllTeams from "./pages/AllTeams";
import { Team } from "./components/Team";
import { Toolbar } from "@mui/material";
import UserProfile from "./components/UserProfile";
import Achievements from "./pages/Achievements";
function App() {

  return (
    <BrowserRouter>
    <NavigationBar />
    <Toolbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile-update" element={<ProfileUpdate />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/teams" element={<AllTeams />} />
        <Route path="/teams/:teamId" element={<Team />} />
        <Route path="/achievements" element={<Achievements />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App
