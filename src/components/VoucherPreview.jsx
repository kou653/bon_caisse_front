import React from 'react';
import '../styles/Voucher.css';

export default function VoucherPreview({ data }) {
  return (
    <div className="voucher-preview-container">
      <div className="voucher-paper">
        <h1 className="voucher-title">BON DE CAISSE</h1>

        <div className="voucher-field">
          <span className="field-label">PROJET :</span>
          <span className="field-dots">{data.project || ''}</span>
        </div>

        <div className="voucher-field">
          <span className="field-label">Montant :</span>
          <span className="field-dots">{data.amount ? data.amount + ' Fcfa' : ''}</span>
        </div>

        <div className="voucher-field" style={{ marginBottom: 0 }}>
          <span className="field-label">Pour le motif :</span>
          <span className="field-dots"></span>
        </div>

        <div className="voucher-reason-block">
          <div className="lines-background">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-line">
                <span className="bg-number">{i + 1}-</span>
              </div>
            ))}
          </div>
          <div className="reason-text">
            {data.reason}
          </div>
        </div>

        <div className="voucher-signatures">
          <div className="signature-block">
            <span className="signature-title">DEMANDEUR</span>
            <div className="signature-space"></div>
          </div>
          <div className="signature-block">
            <span className="signature-title">APPROBATEUR</span>
            <div className="signature-space"></div>
          </div>
          <div className="signature-block">
            <span className="signature-title">COMPTABLE</span>
            <div className="signature-space"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
