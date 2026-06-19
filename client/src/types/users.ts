export type UserRole = "ADMIN" | "PROFESSIONAL" | "ATTENDANT" | "SUPERUSER";

export interface Membership {
  role: UserRole;
  clinic: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_superuser: boolean;
  memberships: Membership[];
}

export interface UserForm {
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  clinic_id: number | null;
  password?: string;
}

export interface UserErrors {
  email?: string;
  first_name?: string;
  last_name?: string;
  clinic?: string;
  password?: string;
  role?: string;
}