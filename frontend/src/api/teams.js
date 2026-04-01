import { request } from "./base";

const ENDPOINT = "/api/teams";

export const getAllTeams = () => request(ENDPOINT);

export const getTeamById = (id) =>
  request(`${ENDPOINT}/${id}`);

export const createTeam = (data) =>
  request(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(data)
  });

export const updateTeam = (id, data) =>
  request(`${ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });

export const deleteTeam = (id) =>
  request(`${ENDPOINT}/${id}`, {
    method: "DELETE"
  });