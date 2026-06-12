import React, { useState } from 'react';
import VoucherForm from './components/VoucherForm';
import VoucherPreview from './components/VoucherPreview';
import VoucherList from './components/VoucherList';
import './App.css';

const emptyVoucher = {
  project: '',
  amount: '',
  reason: '',
  requester_name: '',
  approver_name: '',
  accountant_name: '',
  lines: Array(12).fill('')
};

function App() {
  // 'list' | 'form' | 'view'
  const [page, setPage] = useState('list');
  const [voucherData, setVoucherData] = useState(emptyVoucher);

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
      const response = await fetch('http://localhost:8000/api/cash-vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
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
      <VoucherList
        onNewVoucher={handleNewVoucher}
        onViewVoucher={handleViewVoucher}
      />
    );
  }

  /* ── PAGE CRÉATION ou VISUALISATION ── */
  return (
    <div className="app-container">
      {/* Panneau gauche : uniquement pour le formulaire de création */}
      {page === 'form' && (
        <div className="left-panel">
          {/* Bouton retour */}
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

      {/* Panneau droit : aperçu + impression */}
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
  );
}

export default App;
