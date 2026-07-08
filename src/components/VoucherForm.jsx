import React from 'react';
import '../styles/VoucherForm.css';

export default function VoucherForm({ data, onChange, onSubmit }) {
  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const handleLineChange = (index, value) => {
    const newLines = [...data.lines];
    newLines[index] = value;
    onChange({ ...data, lines: newLines });
  };

  return (
    <div className="voucher-form-container">
      <h2>Créer un Bon de Caisse</h2>
      <form onSubmit={onSubmit} className="voucher-form">
        <div className="form-group">
          <label>Projet</label>
          <input type="text" name="project" value={data.project} onChange={handleChange} placeholder="Nom du projet" />
        </div>

        <div className="form-group">
          <label>Motif</label>
          <textarea 
            name="reason" 
            value={data.reason} 
            onChange={handleChange} 
            placeholder="Saisissez votre motif ici."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Numéro Wave</label>
          <input type="text" name="wave_number" value={data.wave_number} onChange={handleChange} placeholder="Numéro Wave" />
        </div>

        <div className="form-group">
          <label>Nom associé au numéro Wave</label>
          <input type="text" name="wave_name" value={data.wave_name} onChange={handleChange} placeholder="Nom associé" />
        </div>

        <div className="form-group">
          <label>Montant</label>
          <input type="number" step="0.01" name="amount" value={data.amount} onChange={handleChange} placeholder="0.00" />
        </div>

        <button type="submit" className="submit-btn">Enregistrer le Bon</button>
      </form>
    </div>
  );
}
