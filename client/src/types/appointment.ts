import { BaseModel } from "./baseModel";

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

export interface AppointmentForm {
  data_hora: string;
  status: AppointmentStatus;
  detalhes_atendimento: string;
  paciente: number | "";
  profissional: number | "";
}