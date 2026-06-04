import React, { useState } from 'react';
import VoucherForm from './components/VoucherForm';
import VoucherPreview from './components/VoucherPreview';
import './App.css';

function App() {
  const [voucherData, setVoucherData] = useState({
    project: '',
    amount: '',
    reason: '',
    requester_name: '',
    approver_name: '',
    accountant_name: '',
    lines: Array(12).fill('')
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here we'd send to Laravel backend
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
      } else {
        alert("Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur backend (Laravel)");
    }
  };

  return (
    <div className="app-container">
      <div className="left-panel">
        <VoucherForm 
          data={voucherData} 
          onChange={setVoucherData} 
          onSubmit={handleSubmit} 
        />
      </div>
      <div className="right-panel">
        <div className="preview-toolbar">
          <h3>Aperçu du Bon</h3>
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
