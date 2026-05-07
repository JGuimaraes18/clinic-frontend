export type UserRole = "ADMIN" | "PROFESSIONAL" | "ATTENDANT";

export interface UserClinic {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  clinic: UserClinic | null;
  is_superuser: boolean;
}

export interface UserForm {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  clinic: number | null;
  password?: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  clinic?: number | null;
  password?: string;
}

export interface UserErrors {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  clinic?: string;
  password?: string;
}