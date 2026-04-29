import { BaseModel } from "./baseModel";

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

export interface ProfessionalForm {
  full_name: string;
  phone: string;
  email: string;
  registration_type: string;
  registration_number: string;
  specialty: string;
  is_active: boolean;
}