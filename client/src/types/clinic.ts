import { BaseModel } from "./baseModel";

export interface Clinic extends BaseModel {
  id: number;
  name: string;
  slug: string;
  document: string;
  phone: string;
  email: string;
}

export interface ClinicForm {
  name: string;
  slug: string;
  document: string;
  phone: string;
  email: string;
}