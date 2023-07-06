import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
export const AdminPrivateRoute = ({ children }) => {
  const { role } = useContext(AuthContext);
  return role === "Admin" ? children : <Navigate to={"/login"} />;
};
