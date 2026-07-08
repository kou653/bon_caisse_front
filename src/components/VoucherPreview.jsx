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

        <div className="voucher-field-motif">
          <span className="field-label">Motif :</span>
          <div className="reason-multiline-container">
            <div className="reason-lines-bg">
              <div className="bg-line-simple"></div>
              <div className="bg-line-simple"></div>
            </div>
            <div className="reason-text-simple">
              {data.reason}
            </div>
          </div>
        </div>

        <div className="voucher-field">
          <span className="field-label">Numéro wave :</span>
          <span className="field-dots">{data.wave_number || ''}</span>
        </div>

        <div className="voucher-field">
          <span className="field-label">Nom associé :</span>
          <span className="field-dots">{data.wave_name || ''}</span>
        </div>

        <div className="voucher-field">
          <span className="field-label">Montant :</span>
          <span className="field-dots">{data.amount ? data.amount + ' Fcfa' : ''}</span>
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
