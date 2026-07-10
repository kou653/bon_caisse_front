import React, { useEffect, useMemo, useState } from 'react';
import '../styles/VoucherList.css';

const API = 'http://localhost:8000/api';

// Fetch avec timeout de 8s
const fetchWithTimeout = (url, options = {}, ms = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id));
};

// Colonnes filtrables : clé technique, clé du champ voucher, et fonction d'extraction de la valeur affichée
const FILTERABLE_COLUMNS = [
  { key: 'project', field: 'project' },
  { key: 'wave_number', field: 'wave_number' },
  { key: 'wave_name', field: 'wave_name' },
  { key: 'reason', field: 'reason' },
];

const EMPTY_FILTERS = { project: '', wave_number: '', wave_name: '', reason: '', date: '' };

export default function VoucherList({ onNewVoucher, onViewVoucher, authToken, authUser, onLogout }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    fetchWithTimeout(`${API}/cash-vouchers?t=` + Date.now(), {
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Cache-Control': 'no-cache',
      }
    })
      .then(res => {
        if (res.status === 401) {
          onLogout(); // Token expiré → retour login
          return null;
        }
        if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
        return res.json();
      })
      .then(data => {
        if (data === null) return; // 401 géré ci-dessus
        setVouchers(data);
        setLoading(false);
      })
      .catch(err => {
        const msg = err.name === 'AbortError'
          ? 'Le serveur ne répond pas (timeout). Vérifiez que Laravel est démarré.'
          : `Impossible de charger les bons : ${err.message}`;
        setError(msg);
        setLoading(false);
      });
  }, [authToken]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '–';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const formatMontant = (val) => {
    if (!val && val !== 0) return '–';
    return Number(val).toLocaleString('fr-FR') + ' Fcfa';
  };

  // Valeurs uniques disponibles pour chaque colonne filtrable (calculées sur l'ensemble des bons)
  const uniqueValues = useMemo(() => {
    const result = {};
    FILTERABLE_COLUMNS.forEach(({ key, field }) => {
      const set = new Set();
      vouchers.forEach(v => {
        const val = v[field];
        if (val !== null && val !== undefined && String(val).trim() !== '') {
          set.add(String(val));
        }
      });
      result[key] = [...set].sort((a, b) => a.localeCompare(b, 'fr'));
    });
    const dateSet = new Set();
    vouchers.forEach(v => {
      if (v.created_at) dateSet.add(formatDate(v.created_at));
    });
    result.date = [...dateSet].sort((a, b) => {
      // tri chronologique à partir du format jj/mm/aaaa
      const [da, ma, ya] = a.split('/');
      const [db, mb, yb] = b.split('/');
      return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
    });
    return result;
  }, [vouchers]);

  const hasActiveFilters = search !== '' || Object.values(filters).some(v => v !== '');

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setSearch('');
    setFilters(EMPTY_FILTERS);
  };

  const filtered = vouchers.filter(v => {
    const matchesSearch =
      (v.project || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.reason || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.wave_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.wave_name || '').toLowerCase().includes(search.toLowerCase()) ||
      String(v.id).includes(search);

    if (!matchesSearch) return false;

    for (const { key, field } of FILTERABLE_COLUMNS) {
      if (filters[key] && String(v[field] || '') !== filters[key]) return false;
    }
    if (filters.date && formatDate(v.created_at) !== filters.date) return false;

    return true;
  });

  const sorted = filtered;

  const totalMontant = vouchers.reduce((acc, v) => {
    // Nettoie la chaîne (enlève les espaces et remplace la virgule par un point)
    const amountStr = String(v.amount || '').replace(/\s/g, '').replace(',', '.');
    const val = parseFloat(amountStr) || 0;
    return acc + val;
  }, 0);

  const handleLogoutClick = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      onLogout();
    }
  };

  // Petit composant local pour la liste déroulante de filtre par colonne
  const ColumnFilter = ({ filterKey, placeholder }) => (
    <select
      className={`col-filter ${filters[filterKey] ? 'active' : ''}`}
      value={filters[filterKey]}
      onChange={e => handleFilterChange(filterKey, e.target.value)}
      onClick={e => e.stopPropagation()}
    >
      <option value="">{placeholder}</option>
      {uniqueValues[filterKey]?.map(val => (
        <option key={val} value={val}>{val}</option>
      ))}
    </select>
  );

  return (
    <div className="list-page">

      {/* ── Header ── */}
      <div className="list-header">
        <div className="list-header-left">
          <img src="/Fichier 1.png" alt="Logo" className="list-header-logo" />
          <div className="list-header-divider" />
          <div className="list-header-titles">
            <h1>Bons de Caisse</h1>
            <p>Historique des bons enregistrés</p>
          </div>
        </div>
        <div className="list-header-actions">
          {authUser && (
            <span className="list-user-badge">
              👤 {authUser.name}
            </span>
          )}
          <button className="btn-primary" onClick={onNewVoucher}>
            + Nouveau bon
          </button>
          <button className="btn-logout" onClick={handleLogoutClick} title="Se déconnecter">
            ⏻ Déconnexion
          </button>
        </div>
      </div>

      {/* ── Statistiques ── */}
      <div className="list-stats">
        <div className="stat-card">
          <span className="stat-label">Total bons</span>
          <span className="stat-value">{vouchers.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Montant total</span>
          <span className="stat-value">{totalMontant.toLocaleString('fr-FR')} <small style={{fontSize:'0.7em', fontWeight:'normal'}}>Fcfa</small></span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Dernier bon</span>
          <span className="stat-value" style={{fontSize:'1rem'}}>
            {vouchers.length > 0 ? formatDate(vouchers[0].created_at) : '–'}
          </span>
        </div>
      </div>

      {/* ── Recherche ── */}
      <div className="list-search-bar">
        <span className="list-search-icon">⌕</span>
        <input
          type="text"
          placeholder="Rechercher par projet, motif, wave ou numéro..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '1rem' }}
          >✕</button>
        )}
        {hasActiveFilters && (
          <button className="btn-reset-filters" onClick={resetFilters} title="Réinitialiser tous les filtres">
            ↺ Réinitialiser
          </button>
        )}
      </div>

      {/* ── Contenu ── */}
      {loading && (
        <div className="list-loading">
          <div className="spinner" />
          <p>Chargement...</p>
        </div>
      )}

      {error && (
        <div className="list-error">⚠️ {error}</div>
      )}

      {!loading && !error && (
        <div className="list-table-wrapper">
          <table className="list-table">
            <thead>
              <tr>
                <th>N°</th>
                <th><ColumnFilter filterKey="project" placeholder="Projet" /></th>
                <th><ColumnFilter filterKey="wave_number" placeholder="Numéro" /></th>
                <th><ColumnFilter filterKey="wave_name" placeholder="Nom_Demandeur" /></th>
                <th>Montant</th>
                <th><ColumnFilter filterKey="reason" placeholder="Motif" /></th>
                <th><ColumnFilter filterKey="date" placeholder="Date" /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="list-empty">
                      <div className="list-empty-icon">📄</div>
                      <p>{hasActiveFilters ? 'Aucun résultat pour ces critères.' : 'Aucun bon de caisse enregistré.'}</p>
                      {hasActiveFilters && (
                        <button className="btn-reset-filters btn-reset-filters-empty" onClick={resetFilters}>
                          ↺ Réinitialiser les filtres
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map(v => (
                  <tr key={v.id}>
                    <td className="td-id">#{v.id}</td>
                    <td className="td-project">{v.project || <span style={{color:'#ddd'}}>—</span>}</td>
                    <td className="td-wave-number">{v.wave_number || <span style={{color:'#ddd'}}>—</span>}</td>
                    <td className="td-wave-name">{v.wave_name || <span style={{color:'#ddd'}}>—</span>}</td>
                    <td className="td-amount">{formatMontant(v.amount)}</td>
                    <td className="td-reason">{v.reason || <span style={{color:'#ddd'}}>—</span>}</td>
                    <td className="td-date">{formatDate(v.created_at)}</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn-view" onClick={() => onViewVoucher(v)}>
                          Voir →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
