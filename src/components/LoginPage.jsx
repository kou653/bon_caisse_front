import React, { useState } from 'react';
import '../styles/Login.css';

const API = 'http://localhost:8000/api';

export default function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.errors?.email?.[0] ||
          data?.message ||
          'Identifiants incorrects.';
        setError(msg);
        return;
      }

      // Stocker le token dans localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      onLogin(data.user, data.token);
    } catch {
      setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <img src="/SLOGAN.png" alt="DRONEK" />
        </div>

        <h1 className="login-title">Bon de Caisse Numérique</h1>
        <p className="login-subtitle">Connectez-vous pour accéder à l'application</p>
        <hr className="login-divider" />

        {/* Message d'erreur */}
        {error && (
          <div className="login-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-email">Adresse e-mail</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">✉</span>
              <input
                id="login-email"
                type="email"
                className={`login-input${error ? ' error' : ''}`}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@dronek.net"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-password">Mot de passe</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">🔒</span>
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                className={`login-input${error ? ' error' : ''}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPwd((v) => !v)}
                title={showPwd ? 'Masquer' : 'Afficher'}
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading && <span className="login-spinner" />}
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="login-footer">
          DRONEK : Agriculture – Foresterie – Technologie<br />
          © {new Date().getFullYear()} — Tous droits réservés
        </p>
      </div>
    </div>
  );
}
