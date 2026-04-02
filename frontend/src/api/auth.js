import { request } from "./base";

const ENDPOINT = "/api/individuals";

// 🔐 LOGIN
export const login = async (credentials) => {
  const res = await request(`${ENDPOINT}/login`, {
    method: "POST",
    body: JSON.stringify(credentials)
  });

  // 🔥 Store user instead of token (since no JWT yet)
  localStorage.setItem("user", JSON.stringify(res.user));

  return res;
};

// 📝 REGISTER (FIXED endpoint)
export const signup = (data) =>
  request(`${ENDPOINT}/register`, {
    method: "POST",
    body: JSON.stringify(data)
  });

// 🚪 LOGOUT
export const logout = () => {
  localStorage.removeItem("user");
};