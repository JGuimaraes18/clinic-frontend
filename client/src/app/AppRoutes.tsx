import { Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import PrivateRoute from "@/components/auth/PrivateRoute";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Professionals from "@/pages/Professionals";
import Patients from "@/pages/Patients";
import Appointments from "@/pages/Appointments";
import NotFound from "@/pages/NotFound";
import Attendance from "@/pages/Attendance";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="agendamentos" element={<Appointments />} />
          <Route path="pacientes" element={<Patients />} />
          <Route path="profissionais" element={<Professionals />} />
          <Route path="/atendimento/:id" element={<Attendance />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}