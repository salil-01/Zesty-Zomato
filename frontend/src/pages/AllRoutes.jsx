import { Route, Routes } from "react-router-dom";
import Admin from "./Admin";
import Home from "./Home";
import LoginForm from "./Login";
import RegisterForm from "./Register";

export const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
};
