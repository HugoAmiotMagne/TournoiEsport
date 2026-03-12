const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
export const BACKEND_URL = import.meta.env.VITE_API_URL;

// Convertit un chemin d'image en URL complète
// - URL Cloudinary (commence par http) → retournée telle quelle
// - Ancien chemin local (/uploads/...) → préfixé avec le backend
export const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path}`;
};

// Auth
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de connexion');
  return data;
};

export const signupUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");
  return data;
};

// Membres d'équipe
export const getMembresByEquipe = async (equipeId) => {
  const res = await fetch(`${API_BASE_URL}/membreteams/equipe/${equipeId}`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des membres');
  return res.json();
};

export const getMesEquipes = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/membreteams/user/${userId}`);
  if (!res.ok) throw new Error('Erreur lors de la récupération de votre équipe');
  return res.json();
};

export const rejoindreEquipe = async (equipeId, token) => {
  const res = await fetch(`${API_BASE_URL}/membreteams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ equipe: equipeId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");
  return data;
};

export const quitterEquipe = async (membreId, token) => {
  const res = await fetch(`${API_BASE_URL}/membreteams/${membreId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors du départ de l'équipe");
  return data;
};

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
};

// Inscriptions
export const getInscriptionsByEquipe = async (equipeId) => {
  const res = await fetch(`${API_BASE_URL}/inscriptions/equipe/${equipeId}`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des inscriptions');
  return res.json();
};

export const createInscription = async (inscriptionData, token) => {
  const res = await fetch(`${API_BASE_URL}/inscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(inscriptionData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");
  return data;
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
  const res = await fetch(`${API_BASE_URL}/match/${id}`);
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

// Billets
export const getBillets = async () => {
  const res = await fetch(`${API_BASE_URL}/billets`);
  if (!res.ok) throw new Error('Erreur réseau');
  return res.json();
};

export const getBilletById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/billets/${id}`);
  if (!res.ok) throw new Error('Billet introuvable');
  return res.json();
};

export const getMesBillets = async (token) => {
  const res = await fetch(`${API_BASE_URL}/billets/mes-billets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Impossible de récupérer vos billets');
  return res.json();
};

export const createBillet = async (billetData, token) => {
  const res = await fetch(`${API_BASE_URL}/billets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(billetData),
  });
  if (!res.ok) throw new Error('Erreur lors de la création du billet');
  return res.json();
};

export const annulerBillet = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/billets/${id}/annuler`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Impossible d\'annuler le billet');
  return res.json();
};

export const deleteBillet = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/billets/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Impossible de supprimer le billet');
};

// ── ADMIN ──────────────────────────────────────────────────────────────────

export const adminCreateTournoi = async (data, token) => {
  const res = await fetch(`${API_BASE_URL}/tournois`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Erreur création tournoi');
  return json;
};

export const adminUpdateTournoi = async (id, data, token) => {
  const res = await fetch(`${API_BASE_URL}/tournois/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Erreur mise à jour tournoi');
  return json;
};

export const adminDeleteTournoi = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/tournois/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erreur suppression tournoi');
};

export const adminCreateMatch = async (data, token) => {
  const res = await fetch(`${API_BASE_URL}/matches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Erreur création match');
  return json;
};

export const adminUpdateMatch = async (id, data, token) => {
  const res = await fetch(`${API_BASE_URL}/matches/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Erreur mise à jour match');
  return json;
};

export const adminDeleteMatch = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/matches/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erreur suppression match');
};

export const adminCreateBillet = async (data, token) => {
  const res = await fetch(`${API_BASE_URL}/billets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Erreur création billet');
  return json;
};

export const adminUpdateBillet = async (id, data, token) => {
  const res = await fetch(`${API_BASE_URL}/billets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Erreur mise à jour billet');
  return json;
};

export const adminDeleteBillet = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/billets/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erreur suppression billet');
};

export const adminCreateJeu = async (data, token) => {
  const res = await fetch(`${API_BASE_URL}/jeux`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Erreur création jeu');
  return json;
};

export const adminUpdateJeu = async (id, data, token) => {
  const res = await fetch(`${API_BASE_URL}/jeux/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Erreur mise à jour jeu');
  return json;
};

export const adminDeleteJeu = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/jeux/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'Erreur suppression jeu');
};