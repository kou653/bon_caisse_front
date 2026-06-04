import React from 'react';
import '../styles/Voucher.css';

export default function VoucherPreview({ data }) {
  return (
    <div className="voucher-preview-container">
      <div className="voucher-paper">
        <div className="voucher-logo">
          <img src="/SLOGAN.png" alt="Slogan" className="voucher-logo-img" />
        </div>
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
        <div className="voucher-footer">
          <div className="voucher-footer-line"></div>
          <p className="voucher-footer-text">
            <strong>DRONEK : Agriculture – Foresterie - Technologie</strong> Siège Social : Abidjan Cocody 216 Lgts - 15 BP 116 Abidjan 15 - RC N° : CI-CI-ABJ-03-2023-B12-02754 - Tel. : +225 27 21 51 41 49{' '}
            <span className="voucher-footer-link">www.dronek.net</span> E-mail : <span className="voucher-footer-link">info@dronek.net</span> /{' '}
            Banque Nationale d'Investissement N° : CI092 10001 006874350009 19
          </p>
        </div>
      </div>
    </div>
  );
}
