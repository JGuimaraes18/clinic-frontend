import api from "./api";
import { BaseModel } from "./base";

export interface Professional extends BaseModel {
  full_name: string;
  phone: string;
  email: string;

  registration_type: string;
  registration_number: string;
  specialty: string;

  is_active: boolean;
  clinic: number;
}

export async function getProfessionals(): Promise<Professional[]> {
  const response = await api.get("/api/professionals/");
  return response.data;
}