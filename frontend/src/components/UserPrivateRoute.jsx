import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
export const UserPrivateRoute = ({ children }) => {
  const { role } = useContext(AuthContext);
  return role === "User" || "Admin" ? children : <Navigate to={"/login"} />;
};
