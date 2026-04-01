import { request } from "./base";

const ENDPOINT = "/api/achievements";

export const getAllAchievements = () => request(ENDPOINT);

export const getAchievementById = (id) =>
  request(`${ENDPOINT}/${id}`);

export const getAchievementsByTeam = (teamId) =>
  request(`${ENDPOINT}/team/${teamId}`);

export const createAchievement = (data) =>
  request(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(data)
  });

export const deleteAchievement = (id) =>
  request(`${ENDPOINT}/${id}`, {
    method: "DELETE"
  });