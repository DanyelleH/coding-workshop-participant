import { request } from "./base";

const ENDPOINT = "/api/achievements";

export const getAllAchievements = () => request(ENDPOINT);

export const getAchievementById = (id) =>
  request(`${ENDPOINT}/${id}`);

// ✅ FIXED: filter AFTER fetch
export const getAchievementsByTeam = async (teamId) => {
  const data = await request(ENDPOINT);

  return data.filter((a) => a.teamId === teamId);
};

export const createAchievement = (data) =>
  request(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(data)
  });

export const deleteAchievement = (id) =>
  request(`${ENDPOINT}/${id}`, {
    method: "DELETE"
  });