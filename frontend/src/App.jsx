// App.js
import React from "react";
import Navbar from "./components/Navbar";
import { AllRoutes } from "./pages/AllRoutes";

const App = () => {
  return (
    <>
      <Navbar />
      <AllRoutes />
    </>
  );
};

export default App;
