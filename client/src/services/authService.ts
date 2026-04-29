import api from "./api";

export async function login(username: string, password: string) {
  const response = await api.post("/api/token/", {
    username,
    password,
  });

  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/api/auth/me/");
  return response.data;
}