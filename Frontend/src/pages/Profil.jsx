import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMesEquipes, getInscriptionsByEquipe, imgUrl } from '../services/api';

const API_BASE_URL = 'http://localhost:3002/api';

const asym = {
  borderTopLeftRadius: '1.5rem',
  borderTopRightRadius: '0',
  borderBottomLeftRadius: '1.5rem',
  borderBottomRightRadius: '1.5rem',
};

export default function Profil() {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();

  // Données enrichies depuis le backend
  const [fullUser,     setFullUser]     = useState(null);
  const [monEquipe,    setMonEquipe]    = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [dataLoading,  setDataLoading]  = useState(true);

  // Formulaire infos
  const [editMode,    setEditMode]    = useState(false);
  const [form,        setForm]        = useState({ prenom: '', nom: '', email: '', date_de_naissance: '' });
  const [infoMsg,     setInfoMsg]     = useState('');
  const [infoErr,     setInfoErr]     = useState('');
  const [infoLoading, setInfoLoading] = useState(false);

  // Formulaire mot de passe
  const [pwForm,    setPwForm]    = useState({ ancienMotDePasse: '', nouveauMotDePasse: '', confirm: '' });
  const [pwMsg,     setPwMsg]     = useState('');
  const [pwErr,     setPwErr]     = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);

  // Suppression
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const fetchAll = async () => {
      try {
        const [userRes, memberships] = await Promise.all([
          fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(r => r.json()),
          getMesEquipes(userId).catch(() => []),
        ]);

        setFullUser(userRes);
        setForm({
          prenom: userRes.prenom || '',
          nom:    userRes.nom    || '',
          email:  userRes.email  || '',
          date_de_naissance: userRes.date_de_naissance
            ? new Date(userRes.date_de_naissance).toISOString().split('T')[0]
            : '',
        });

        if (memberships.length > 0) {
          setMonEquipe(memberships[0]);
          const equipeId = memberships[0].equipe?._id;
          if (equipeId) {
            const insc = await getInscriptionsByEquipe(equipeId).catch(() => []);
            setInscriptions(insc);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchAll();
  }, [userId]);

  if (!user) return null;

  const handleInfoUpdate = async (e) => {
    e.preventDefault();
    setInfoLoading(true);
    setInfoErr('');
    setInfoMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la mise à jour');
      login({ ...user, prenom: form.prenom, nom: form.nom, email: form.email }, token);
      setFullUser(prev => ({ ...prev, ...form }));
      setInfoMsg('Profil mis à jour !');
      setEditMode(false);
    } catch (err) {
      setInfoErr(err.message);
    } finally {
      setInfoLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.nouveauMotDePasse !== pwForm.confirm) {
      setPwErr('Les mots de passe ne correspondent pas');
      return;
    }
    setPwLoading(true);
    setPwErr('');
    setPwMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ancienMotDePasse:  pwForm.ancienMotDePasse,
          nouveauMotDePasse: pwForm.nouveauMotDePasse,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur');
      setPwMsg('Mot de passe modifié avec succès !');
      setPwForm({ ancienMotDePasse: '', nouveauMotDePasse: '', confirm: '' });
      setPwVisible(false);
    } catch (err) {
      setPwErr(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      logout();
      navigate('/');
    } catch (err) {
      setInfoErr(err.message);
      setDeleteLoading(false);
    }
  };

  const displayName  = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || user.email;
  const initials     = ((user.prenom?.[0] ?? '') + (user.nom?.[0] ?? '')).toUpperCase() || '?';
  const memberSince  = fullUser?.createdAt
    ? new Date(fullUser.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : null;
  const equipe = monEquipe?.equipe;

  return (
    <div className="min-h-screen bg-[#E8F5A8] w-full">

      {/* ── Bannière ── */}
      <div className="w-full bg-gradient-to-br from-green-600 to-green-700 py-12 sm:py-16 px-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center shadow-xl border-4 border-white">
            <span className="text-green-900 font-black text-3xl">{initials}</span>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-yellow-300" style={{ fontFamily: 'Georgia, serif' }}>
              {displayName}
            </h1>
            <p className="text-green-200 text-sm mt-1">{user.email}</p>
            {memberSince && (
              <p className="text-green-300 text-xs mt-1">Membre depuis {memberSince}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">

        {/* ── Mes informations ── */}
        <section>
          <h2 className="text-gray-700 font-bold text-lg mb-4">Mes informations</h2>
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 sm:p-8 text-white shadow-xl" style={asym}>
            {infoMsg && (
              <div className="bg-green-900/40 border border-green-400 text-green-200 rounded-xl px-4 py-3 mb-5 text-sm text-center">
                {infoMsg}
              </div>
            )}
            {infoErr && (
              <div className="bg-red-900/40 border border-red-500 text-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-center">
                {infoErr}
              </div>
            )}

            {!editMode ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <InfoRow label="Prénom"              value={fullUser?.prenom}            loading={dataLoading} />
                  <InfoRow label="Nom"                 value={fullUser?.nom}               loading={dataLoading} />
                  <InfoRow label="Email"               value={fullUser?.email}             loading={dataLoading} />
                  <InfoRow
                    label="Date de naissance"
                    value={fullUser?.date_de_naissance
                      ? new Date(fullUser.date_de_naissance).toLocaleDateString('fr-FR')
                      : null}
                    loading={dataLoading}
                  />
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold text-sm px-6 py-3 rounded-xl transition-all hover:scale-[1.02]"
                >
                  Modifier mes informations
                </button>
              </div>
            ) : (
              <form onSubmit={handleInfoUpdate} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Prénom *" value={form.prenom} onChange={e => setForm(p => ({ ...p, prenom: e.target.value }))} required />
                  <Field label="Nom *"    value={form.nom}    onChange={e => setForm(p => ({ ...p, nom:    e.target.value }))} required />
                </div>
                <Field label="Email *" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                <Field label="Date de naissance *" type="date" value={form.date_de_naissance} onChange={e => setForm(p => ({ ...p, date_de_naissance: e.target.value }))} required />
                <div className="flex gap-3 mt-2">
                  <button type="submit" disabled={infoLoading}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-green-900 font-bold text-sm py-3 rounded-xl transition-all">
                    {infoLoading ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                  <button type="button" onClick={() => { setEditMode(false); setInfoErr(''); }}
                    className="flex-1 bg-green-800 hover:bg-green-900 text-green-100 font-bold text-sm py-3 rounded-xl transition-all">
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ── Mon équipe ── */}
        <section>
          <h2 className="text-gray-700 font-bold text-lg mb-4">Mon équipe</h2>
          {dataLoading ? (
            <div className="h-20 bg-green-200/40 rounded-2xl animate-pulse" />
          ) : equipe ? (
            <Link to={`/teams/${equipe._id}`} className="block group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-5 sm:p-6 text-white shadow-xl group-hover:shadow-2xl group-hover:scale-[1.01] transition-all" style={asym}>
                <div className="flex items-center gap-4">
                  {equipe.logo ? (
                    <img src={imgUrl(equipe.logo)} alt={equipe.Name} className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400 flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center font-black text-green-900 text-xl flex-shrink-0">
                      {equipe.Name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-lg truncate">{equipe.Name}</p>
                    <p className="text-green-200 text-sm truncate">{equipe.description || 'Aucune description'}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${
                    monEquipe.role === 'capitaine' ? 'bg-yellow-400 text-green-900' : 'bg-green-800 text-green-200 border border-green-600'
                  }`}>
                    {monEquipe.role === 'capitaine' ? '⭐ Capitaine' : monEquipe.role}
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-xl" style={asym}>
              <p className="text-green-200 text-sm mb-4">Tu n'es membre d'aucune équipe pour l'instant.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/teams" className="flex-1 text-center py-3 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-xl transition-all text-sm">
                  Rejoindre une équipe
                </Link>
                <Link to="/teams/new" className="flex-1 text-center py-3 bg-green-800 hover:bg-green-900 border border-green-500 text-green-100 font-bold rounded-xl transition-all text-sm">
                  Créer une équipe
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── Inscriptions aux tournois ── */}
        {equipe && (
          <section>
            <h2 className="text-gray-700 font-bold text-lg mb-4">
              Inscriptions aux tournois
              <span className="ml-2 text-sm font-normal text-gray-500">({inscriptions.length})</span>
            </h2>
            {dataLoading ? (
              <div className="h-20 bg-green-200/40 rounded-2xl animate-pulse" />
            ) : inscriptions.length === 0 ? (
              <div className="bg-white/60 border border-green-200 rounded-2xl p-6 text-center">
                <p className="text-gray-500 text-sm">Aucune inscription pour le moment.</p>
                <Link to="/tournois" className="mt-3 inline-block text-green-700 font-semibold text-sm hover:underline">
                  Voir les tournois disponibles →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {inscriptions.map(insc => (
                  <div key={insc._id} className="bg-gradient-to-br from-green-600 to-green-700 px-5 py-4 text-white shadow flex items-center gap-4" style={asym}>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{insc.tournoi?.Name ?? '—'}</p>
                      <p className="text-green-200 text-xs mt-0.5">
                        {insc.tournoi?.date_debut
                          ? new Date(insc.tournoi.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${
                      insc.statut === 'acceptee' ? 'bg-green-400/30 border border-green-400 text-green-300' :
                      insc.statut === 'refusee'  ? 'bg-red-400/30 border border-red-400 text-red-300' :
                      'bg-yellow-400/20 border border-yellow-400 text-yellow-300'
                    }`}>
                      {insc.statut === 'acceptee' ? 'Acceptée' : insc.statut === 'refusee' ? 'Refusée' : 'En attente'}
                    </span>
                    <Link to={`/tournois/${insc.tournoi?._id}`} className="text-green-300 hover:text-yellow-300 transition-colors flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Changer le mot de passe ── */}
        <section>
          <h2 className="text-gray-700 font-bold text-lg mb-4">Mot de passe</h2>
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 sm:p-8 text-white shadow-xl" style={asym}>
            {!pwVisible ? (
              <div className="flex items-center justify-between">
                <p className="text-green-200 text-sm">••••••••••••</p>
                <button
                  onClick={() => setPwVisible(true)}
                  className="bg-green-800 hover:bg-green-900 border border-green-500 text-green-100 font-bold text-sm px-5 py-2.5 rounded-xl transition-all"
                >
                  Modifier
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                {pwMsg && (
                  <div className="bg-green-900/40 border border-green-400 text-green-200 rounded-xl px-4 py-3 text-sm text-center">
                    {pwMsg}
                  </div>
                )}
                {pwErr && (
                  <div className="bg-red-900/40 border border-red-500 text-red-200 rounded-xl px-4 py-3 text-sm text-center">
                    {pwErr}
                  </div>
                )}
                <Field label="Ancien mot de passe" type="password" value={pwForm.ancienMotDePasse}
                  onChange={e => { setPwErr(''); setPwForm(p => ({ ...p, ancienMotDePasse: e.target.value })); }} required />
                <Field label="Nouveau mot de passe (min. 8 caractères)" type="password" value={pwForm.nouveauMotDePasse}
                  onChange={e => { setPwErr(''); setPwForm(p => ({ ...p, nouveauMotDePasse: e.target.value })); }} required />
                <Field label="Confirmer le nouveau mot de passe" type="password" value={pwForm.confirm}
                  onChange={e => { setPwErr(''); setPwForm(p => ({ ...p, confirm: e.target.value })); }} required />
                <div className="flex gap-3 mt-2">
                  <button type="submit" disabled={pwLoading}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-green-900 font-bold text-sm py-3 rounded-xl transition-all">
                    {pwLoading ? 'Modification…' : 'Modifier le mot de passe'}
                  </button>
                  <button type="button"
                    onClick={() => { setPwVisible(false); setPwErr(''); setPwMsg(''); setPwForm({ ancienMotDePasse: '', nouveauMotDePasse: '', confirm: '' }); }}
                    className="flex-1 bg-green-800 hover:bg-green-900 text-green-100 font-bold text-sm py-3 rounded-xl transition-all">
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ── Zone dangereuse ── */}
        <section>
          <h2 className="text-red-700 font-bold text-lg mb-4">Zone dangereuse</h2>
          <div className="bg-red-900/10 border border-red-400 rounded-2xl p-6">
            <p className="text-red-600 text-sm mb-4">
              La suppression de ton compte est définitive et irréversible. Toutes tes données seront perdues.
            </p>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all">
                Supprimer mon compte
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-red-700 font-semibold text-sm">Es-tu sûr ? Cette action est irréversible.</p>
                <div className="flex gap-3">
                  <button onClick={handleDelete} disabled={deleteLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all">
                    {deleteLoading ? 'Suppression…' : 'Oui, supprimer'}
                  </button>
                  <button onClick={() => setConfirmDelete(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-sm px-5 py-2.5 rounded-xl transition-all">
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

function InfoRow({ label, value, loading }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-green-300 text-xs font-medium uppercase tracking-wider">{label}</span>
      {loading ? (
        <div className="h-5 bg-green-500/30 rounded animate-pulse w-32" />
      ) : (
        <span className="text-white font-semibold text-base">{value || '—'}</span>
      )}
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="block text-green-100 text-sm font-medium mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-green-800 text-white placeholder-green-400 rounded-xl px-4 py-3 text-sm outline-none border-2 border-green-600 focus:border-yellow-400 transition-colors"
      />
    </div>
  );
}
