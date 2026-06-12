import React, { useEffect, useState } from 'react';
import '../styles/VoucherList.css';

export default function VoucherList({ onNewVoucher, onViewVoucher }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/cash-vouchers?t=' + Date.now(), {
      headers: { 
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur serveur');
        return res.json();
      })
      .then(data => {
        setVouchers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Impossible de charger les bons. Vérifiez que le serveur Laravel est démarré.');
        setLoading(false);
      });
  }, []);

  const filtered = vouchers.filter(v =>
    (v.project || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.reason || '').toLowerCase().includes(search.toLowerCase()) ||
    String(v.id).includes(search)
  );

  console.log("Calcul totalMontant pour vouchers:", vouchers);
  const totalMontant = vouchers.reduce((acc, v) => {
    // Nettoie la chaîne (enlève les espaces et remplace la virgule par un point)
    const amountStr = String(v.amount || '').replace(/\s/g, '').replace(',', '.');
    const val = parseFloat(amountStr) || 0;
    console.log(`id: ${v.id}, amount brut: ${v.amount}, nettoyé: ${amountStr}, parsed: ${val}`);
    return acc + val;
  }, 0);
  console.log("totalMontant calculé:", totalMontant);

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
        <button className="btn-primary" onClick={onNewVoucher}>
          + Nouveau bon
        </button>
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
          placeholder="Rechercher par projet, motif ou numéro..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '1rem' }}
          >✕</button>
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
                <th>Projet</th>
                <th>Montant</th>
                <th>Motif</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="list-empty">
                      <div className="list-empty-icon">📄</div>
                      <p>{search ? 'Aucun résultat pour cette recherche.' : 'Aucun bon de caisse enregistré.'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(v => (
                  <tr key={v.id}>
                    <td className="td-id">#{v.id}</td>
                    <td className="td-project">{v.project || <span style={{color:'#ddd'}}>—</span>}</td>
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
