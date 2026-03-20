const API =
  window.location.hostname === "localhost" ? "http://localhost:3000" : "/api";

// export const getStudents = () => fetch(`${API}/results`).then((r) => r.json());
// export const getStudents = (streamId) =>
//   fetch(`${API}/results?streamId=${streamId}`).then((r) => r.json());

export const getStudents = async (streamId) => {
  const url = streamId
    ? `${API}/results?streamId=${streamId}`
    : `${API}/results`;

  const r = await fetch(url);
  return await r.json();
};

export const getStudent = (id) =>
  fetch(`${API}/results/${id}`).then((r) => r.json());

export const getSprints = () => fetch(`${API}/sprints`).then((r) => r.json());

// export const getTasks = (streamId) =>
//   fetch(`${API}/tasks?streamId=${streamId}`).then((r) => r.json());

// export const getTasks = (streamId) => {
//   const url = streamId ? `${API}/tasks?streamId=${streamId}` : `${API}/tasks`;

//   return fetch(url).then((r) => r.json());
// };
export const getTasks = async (streamId) => {
  const url = streamId ? `${API}/tasks?streamId=${streamId}` : `${API}/tasks`;

  const r = await fetch(url);
  return await r.json();
};
export const getStreams = async () => {
  const res = await fetch(`${API}/streams`);
  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("STREAMS ERROR:", data);
    return [];
  }

  return data;
};
