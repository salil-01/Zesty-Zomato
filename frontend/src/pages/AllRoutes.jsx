import { Route, Routes } from "react-router-dom";
import { AdminPrivateRoute } from "../components/AdminPrivateRoute";
import { UserPrivateRoute } from "../components/UserPrivateRoute";
import Admin from "./Admin";
import FileNotFound from "./FileNotFound";
import Home from "./Home";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import { UserOrders } from "./UserOrder.jsx";

export const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/admin"
          element={
            <AdminPrivateRoute>
              <Admin />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/user-orders"
          element={
            <UserPrivateRoute>
              <UserOrders />
            </UserPrivateRoute>
          }
        />
        <Route path="*" element={<FileNotFound />} />
      </Routes>
    </>
  );
};
