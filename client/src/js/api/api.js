const API =
  window.location.hostname === "localhost" ? "http://localhost:3000" : "/api";

export const getStudents = () => fetch(`${API}/results`).then((r) => r.json());

export const getStudent = (id) =>
  fetch(`${API}/results/${id}`).then((r) => r.json());

export const getSprints = () => fetch(`${API}/sprints`).then((r) => r.json());

export const getTasks = () => fetch(`${API}/tasks`).then((r) => r.json());
