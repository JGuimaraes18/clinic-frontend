import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Patients from "@/pages/Patients";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute children={undefined}>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/pacientes"
        element={
          <PrivateRoute children={undefined}>
            <Patients />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}