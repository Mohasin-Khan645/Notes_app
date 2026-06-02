import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { KeyRound, Mail, User, ShieldAlert, Cpu } from 'lucide-react';
import './AuthPage.css';

const AuthPage = () => {
  const { login, register, loginWithSocial, error, setError } = useContext(AuthContext);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Social Identity Setup Modal States
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialProvider, setSocialProvider] = useState('');
  const [socialUsername, setSocialUsername] = useState('');
  const [socialEmail, setSocialEmail] = useState('');
  const [socialId, setSocialId] = useState('');

  // Clear errors on tab transition
  useEffect(() => {
    setError(null);
  }, [isLoginTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLoginTab && !username)) {
      setError('ALL SECURITY SECTORS ARE REQUIRED');
      return;
    }

    setIsAuthenticating(true);
    
    // Decryption validation latency
    setTimeout(async () => {
      let success = false;
      if (isLoginTab) {
        success = await login(email, password);
      } else {
        success = await register(username, email, password);
      }
      setIsAuthenticating(false);
    }, 1200);
  };

  const triggerSocialModal = (provider) => {
    setSocialProvider(provider);
    setSocialUsername('');
    setSocialEmail('');
    setSocialId('');
    setError(null);
    setShowSocialModal(true);
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    if (!socialUsername || !socialEmail || !socialId) {
      setError('ALL SECURE SOCIAL SECTORS ARE REQUIRED');
      return;
    }

    setIsAuthenticating(true);
    setShowSocialModal(false);

    // Dynamic latency mapping to give netrunner feel
    setTimeout(async () => {
      const success = await loginWithSocial(socialProvider, socialUsername, socialEmail, socialId);
      setIsAuthenticating(false);
    }, 1200);
  };

  return (
    <div className="auth-matrix-viewport">
      {/* HUD Diagonal Grid lines */}
      <div className="hud-cyber-grid"></div>
      <div className="hud-laser-scan"></div>

      <div className="auth-matrix-card cyber-panel">
        {/* Core Secure Minimalist Graphic */}
        <div className="auth-logo-minimalist">
          <KeyRound size={28} className="text-cyan animate-pulse" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.6))' }} />
        </div>

        <div className="auth-matrix-brand">
          <h1 className="brand-title hud-font">NEURAL VAULT</h1>
          <p className="brand-sub hud-font">IDENTITY ACCESS SECTOR</p>
        </div>

        {/* Tab Handshake Selectors */}
        <div className="auth-tab-row hud-font">
          <button 
            type="button"
            className={`auth-tab-btn ${isLoginTab ? 'active text-cyan' : ''}`}
            onClick={() => setIsLoginTab(true)}
            disabled={isAuthenticating}
          >
            [ INITIATE UPLINK ]
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${!isLoginTab ? 'active text-magenta' : ''}`}
            onClick={() => setIsLoginTab(false)}
            disabled={isAuthenticating}
          >
            [ CREATE NODE ]
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="auth-form-matrix">
          {!isLoginTab && (
            <div className="auth-input-group">
              <div className="auth-input-icon">
                <User size={16} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="OPERATOR DESIGNATION"
                className="auth-matrix-input"
                disabled={isAuthenticating}
                required
              />
              <span className="input-bar magenta"></span>
            </div>
          )}

          <div className="auth-input-group">
            <div className="auth-input-icon">
              <Mail size={16} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="UPLINK COORDINATE (EMAIL)"
              className="auth-matrix-input"
              disabled={isAuthenticating}
              required
            />
            <span className="input-bar cyan"></span>
          </div>

          <div className="auth-input-group">
            <div className="auth-input-icon">
              <KeyRound size={16} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ACCESS DECRYPTION CODE"
              className="auth-matrix-input"
              disabled={isAuthenticating}
              required
            />
            <span className="input-bar purple"></span>
          </div>

          {error && (
            <div className="auth-matrix-error hud-font">
              <ShieldAlert size={14} className="err-icon" />
              <span>{error.toUpperCase()}</span>
            </div>
          )}

          <button 
            type="submit" 
            className={`auth-matrix-submit hud-font ${isLoginTab ? 'btn-cyan' : 'btn-magenta'}`}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <div className="spinner-handshake">
                <Cpu size={14} className="spin-slow" />
                <span>SECURE VERIFICATION IN PROGRESS...</span>
              </div>
            ) : (
              <span>{isLoginTab ? 'ESTABLISH NEURAL HANDSHAKE' : 'PROVISION USER MEMORY SECTOR'}</span>
            )}
          </button>

          {/* Social Conduits Division */}
          <div className="auth-social-divider hud-font">
            <span>// OR DIRECT UPLINK ROUTE</span>
          </div>

          <div className="auth-social-grid">
            <button
              type="button"
              className="social-uplink-btn google hud-font"
              onClick={() => triggerSocialModal('Google')}
              disabled={isAuthenticating}
            >
              <Cpu size={12} style={{ marginRight: '6px' }} />
              GOOGLE LINK
            </button>
            
            <button
              type="button"
              className="social-uplink-btn github hud-font"
              onClick={() => triggerSocialModal('GitHub')}
              disabled={isAuthenticating}
            >
              <Cpu size={12} style={{ marginRight: '6px' }} />
              GITHUB LINK
            </button>
          </div>
        </form>
      </div>

      {/* Futuristic Social Credentials Handshake Popup Modal */}
      {showSocialModal && (
        <div className="social-setup-modal-overlay">
          <div className="social-setup-modal cyber-panel">
            <div className="modal-headerhud hud-font">
              <Cpu size={16} className="spin-slow text-cyan" />
              <span>DIRECT SOCIAL UPLINK: {socialProvider.toUpperCase()}</span>
            </div>
            
            <p className="modal-description">
              Establish a secure coordinate mapping. Your real active {socialProvider} credentials will configure a cryptographically isolated operator vault in the database.
            </p>

            <form onSubmit={handleSocialSubmit} className="modal-form-matrix">
              <div className="auth-input-group">
                <div className="auth-input-icon">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={socialUsername}
                  onChange={(e) => setSocialUsername(e.target.value)}
                  placeholder="CHOOSE OPERATOR DESIGNATION (USERNAME)"
                  className="auth-matrix-input"
                  required
                />
                <span className="input-bar magenta"></span>
              </div>

              <div className="auth-input-group">
                <div className="auth-input-icon">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={socialEmail}
                  onChange={(e) => setSocialEmail(e.target.value)}
                  placeholder={`ENTER REAL ${socialProvider.toUpperCase()} EMAIL`}
                  className="auth-matrix-input"
                  required
                />
                <span className="input-bar cyan"></span>
              </div>

              <div className="auth-input-group">
                <div className="auth-input-icon">
                  <Cpu size={16} />
                </div>
                <input
                  type="text"
                  value={socialId}
                  onChange={(e) => setSocialId(e.target.value)}
                  placeholder={`ENTER REAL ${socialProvider.toUpperCase()} ID (NUMERIC KEY)`}
                  className="auth-matrix-input"
                  required
                />
                <span className="input-bar purple"></span>
              </div>

              <div className="modal-btn-row">
                <button
                  type="button"
                  className="modal-cancel-btn hud-font"
                  onClick={() => setShowSocialModal(false)}
                >
                  [ DE-AUTHORIZE ]
                </button>
                <button
                  type="submit"
                  className={`modal-confirm-btn hud-font ${socialProvider === 'Google' ? 'btn-cyan' : 'btn-magenta'}`}
                >
                  INITIALIZE NEURAL CONNECTOME
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
