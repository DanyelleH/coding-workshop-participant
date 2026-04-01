import { request } from "./base";

const ENDPOINT = "/api/individuals";

export const login = async (credentials) => {
  const res = await request(`${ENDPOINT}/login`, {
    method: "POST",
    body: JSON.stringify(credentials)
  });

  localStorage.setItem("token", res.token);
  return res;
};

export const signup = (data) =>
  request(`${ENDPOINT}/signup`, {
    method: "POST",
    body: JSON.stringify(data)
  });

export const logout = () => {
  localStorage.removeItem("token");
};