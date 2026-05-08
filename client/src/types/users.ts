export type UserRole = "ADMIN" | "PROFESSIONAL" | "ATTENDANT";

export interface Membership {
  id: number;
  role: UserRole;
  clinic: {
    id: number;
    name: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_superuser: boolean;
  memberships: Membership[];
}

export interface UserForm {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  clinic_id: number | null;
  password?: string;
}

// export interface UserUpdate {
//   username?: string;
//   email?: string;
//   first_name?: string;
//   last_name?: string;
//   role?: UserRole;
//   clinic?: number | null;
//   password?: string;
// }

export interface UserErrors {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  clinic?: string;
  password?: string;
}