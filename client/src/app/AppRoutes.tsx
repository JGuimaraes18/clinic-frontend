import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Patients from "@/pages/Patients";
import NotFound from "@/pages/NotFound";
import PrivateRoute from "@/components/auth/PrivateRoute";
import AppLayout from "@/components/layout/AppLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute children={undefined} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pacientes" element={<Patients />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}