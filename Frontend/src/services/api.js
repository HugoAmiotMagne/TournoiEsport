const API_BASE_URL = 'http://localhost:3002/api';

// Tournois
export const getTournois = async () => {
  const res = await fetch(`${API_BASE_URL}/tournois`);
  if (!res.ok) throw new Error('Erreur réseau');
  return res.json();
};

export const getTournoiById = async (id, populate = '') => {
  const params = new URLSearchParams();
  if (populate) params.append('populate', populate);
  
  const res = await fetch(`${API_BASE_URL}/tournois/${id}${params.toString() ? '?' + params.toString() : ''}`);
  if (!res.ok) throw new Error('Tournoi introuvable');
  return res.json();
};

// Équipes
export const searchEquipes = async (searchTerm) => {
  const res = await fetch(`${API_BASE_URL}/equipes?search=${encodeURIComponent(searchTerm)}`);
  if (!res.ok) throw new Error('Erreur lors de la recherche');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const getEquipeById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/equipes/${id}`);
  if (!res.ok) throw new Error('Équipe introuvable');
  return res.json();
}

// Inscriptions
export const createInscription = async (inscriptionData) => {
  const res = await fetch(`${API_BASE_URL}/inscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inscriptionData),
  });
  if (!res.ok) throw new Error('Erreur lors de l\'inscription');
  return res.json();
};

// Utilisateurs
export const getUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/users`);
  if (!res.ok) throw new Error('Erreur réseau');
  return res.json();
};

export const getUserById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error('Utilisateur introuvable');
  return res.json();
};

// Jeux
export const getJeux = async () => {
  const res = await fetch(`${API_BASE_URL}/jeux`);
  if (!res.ok) throw new Error('Erreur réseau');
  return res.json();
};

export const getJeuById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/jeux/${id}`);
  if (!res.ok) throw new Error('Jeu introuvable');
  return res.json();
};

// Salles
export const getSalles = async () => {
  const res = await fetch(`${API_BASE_URL}/salles`);
  if (!res.ok) throw new Error('Erreur réseau');
  return res.json();
};

export const getSalleById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/salles/${id}`);
  if (!res.ok) throw new Error('Salle introuvable');
  return res.json();
};

// Matchs
export const getMatchs = async () => {
  const res = await fetch(`${API_BASE_URL}/matches`);
  if (!res.ok) throw new Error('Erreur réseau');
  return res.json();
};

export const getMatchById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/matchs/${id}`);
  if (!res.ok) throw new Error('Match introuvable');
  return res.json();
};

// Bars
export const getBars = async () => {
  const res = await fetch(`${API_BASE_URL}/bars`);
  if (!res.ok) throw new Error('Erreur réseau');
  return res.json();
};

export const getBarById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/bars/${id}`);
  if (!res.ok) throw new Error('Bar introuvable');
  return res.json();
};
