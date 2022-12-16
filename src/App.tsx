import React from "react";

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Chat from "./Chat";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import AddFriend from "./AddFriend";

function App() {
  return (
    <div className="App flex flex-col justify-center items-center w-screen h-screen">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/addFriend" element={<AddFriend />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
