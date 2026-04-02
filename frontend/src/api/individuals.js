import { request } from "./base";

const ENDPOINT = "/api/individuals";

export const getAllIndividuals = () => request(ENDPOINT);

export const getIndividualById = (id) =>
  request(`${ENDPOINT}/${id}`);

export const createIndividual = (data) =>
  request(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(data)
  });

export const updateIndividual = (id, data) =>
  request(`${ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });

export const deleteIndividual = (id) =>
  request(`${ENDPOINT}/${id}`, {
    method: "DELETE"
  });
  