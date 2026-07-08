import React, { useState, useEffect } from 'react';
import VoucherForm from './components/VoucherForm';
import VoucherPreview from './components/VoucherPreview';
import VoucherList from './components/VoucherList';
import LoginPage from './components/LoginPage';
import './App.css';

const API = 'http://localhost:8000/api';

const emptyVoucher = {
  project: '',
  amount: '',
  reason: '',
  wave_number: '',
  wave_name: '',
  requester_name: '',
  approver_name: '',
  accountant_name: '',
  lines: Array(12).fill('')
};

function App() {
  // ── Auth ──
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('auth_token'));
  const [authUser,  setAuthUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user')); } catch { return null; }
  });

  // ── Navigation ──
  const [page, setPage]               = useState('list');
  const [voucherData, setVoucherData] = useState(emptyVoucher);

  // ── Offline banner ──
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline  = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online',  goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online',  goOnline);
    };
  }, []);

  // ─────────────────────────────────────────────
  // Page de connexion
  // ─────────────────────────────────────────────
  if (!authToken) {
    const handleLogin = (user, token) => {
      setAuthToken(token);
      setAuthUser(user);
    };
    return <LoginPage onLogin={handleLogin} />;
  }

  // ─────────────────────────────────────────────
  // Déconnexion
  // ─────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await fetch(`${API}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });
    } catch { /* ignorer les erreurs réseau */ }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setAuthToken(null);
    setAuthUser(null);
    setPage('list');
  };

  // ─────────────────────────────────────────────
  // Enregistrement
  // ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...voucherData,
      lines: voucherData.lines.map((content, index) => ({
        line_number: index + 1,
        content: content
      }))
    };

    try {
      const response = await fetch(`${API}/cash-vouchers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (response.ok) {
        alert('Bon de caisse enregistré avec succès !');
        setPage('list');
      } else {
        alert("Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur backend (Laravel)");
    }
  };

  // Ouvre un bon existant en lecture seule
  const handleViewVoucher = (voucher) => {
    setVoucherData({
      project: voucher.project || '',
      amount: voucher.amount || '',
      reason: voucher.reason || '',
      wave_number: voucher.wave_number || '',
      wave_name: voucher.wave_name || '',
      requester_name: voucher.requester_name || '',
      approver_name: voucher.approver_name || '',
      accountant_name: voucher.accountant_name || '',
      lines: Array(12).fill('')
    });
    setPage('view');
  };

  // Nouveau bon vierge
  const handleNewVoucher = () => {
    setVoucherData(emptyVoucher);
    setPage('form');
  };

  /* ── PAGE LISTE ── */
  if (page === 'list') {
    return (
      <>
        {isOffline && (
          <div className="offline-banner">
            📶 Hors ligne — certaines fonctionnalités peuvent être indisponibles
          </div>
        )}
        <VoucherList
          onNewVoucher={handleNewVoucher}
          onViewVoucher={handleViewVoucher}
          authToken={authToken}
          authUser={authUser}
          onLogout={handleLogout}
        />
      </>
    );
  }

  /* ── PAGE CRÉATION ou VISUALISATION ── */
  return (
    <>
      {isOffline && (
        <div className="offline-banner">
          📶 Hors ligne — l'enregistrement est indisponible
        </div>
      )}
      <div className="app-container">
        {page === 'form' && (
          <div className="left-panel">
            <button className="back-btn" onClick={() => setPage('list')}>
              ← Retour à la liste
            </button>
            <VoucherForm
              data={voucherData}
              onChange={setVoucherData}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        <div className="right-panel">
          <div className="preview-toolbar">
            {page === 'view' && (
              <button className="back-btn" style={{ marginBottom: 0 }} onClick={() => setPage('list')}>
                ← Retour à la liste
              </button>
            )}
            <h3>{page === 'form' ? 'Aperçu du Bon' : 'Bon de Caisse'}</h3>
            <button className="print-btn" onClick={() => window.print()}>Imprimer</button>
          </div>
          <div className="preview-wrapper">
            <VoucherPreview data={voucherData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
