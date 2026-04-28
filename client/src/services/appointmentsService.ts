import api from "./api";
import { BaseModel } from "./base";

export type AppointmentStatus =
  | "AGENDADO"
  | "CANCELADO"
  | "REALIZADO";

export interface Appointment extends BaseModel {
  data_hora: string;
  status: AppointmentStatus;
  observacoes: string;
  clinic: number;
  paciente: number;
  paciente_nome: string;
  profissional: number;
  profissional_nome: string;
}

export async function getAppointments(): Promise<Appointment[]> {
  const response = await api.get("/api/appointments/");
  return response.data;
}