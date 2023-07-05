// App.js
import React from "react";
import { Chatbot } from "./components/ChatBot";
import Navbar from "./components/Navbar";
import { AllRoutes } from "./pages/AllRoutes";

const App = () => {
  return (
    <>
      <Navbar />
      <AllRoutes />
      <Chatbot />
    </>
  );
};

export default App;
