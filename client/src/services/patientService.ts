import api from "./api";
import { BaseModel } from "./base";

export interface Patient extends BaseModel {
  full_name: string;
  cpf: string;
  cpf_hash: string;
  document: string | null;
  phone: string;
  email: string;
  birth_date: string;
  clinic: number;
}

export async function getPatients(): Promise<Patient[]> {
  const response = await api.get("/api/patients/");
  return response.data;
}