import React, { useState, useEffect, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { MemoryProvider, MemoryContext } from './context/MemoryContext';
import Dashboard from './components/Dashboard/Dashboard';
import MemoryMap from './components/MemoryMap/MemoryMap';
import Timeline from './components/Timeline/Timeline';
import Analytics from './components/Analytics/Analytics';
import Settings from './components/Settings/Settings';
import MemoryModal from './components/UI/MemoryModal';
import DevBotAssistant from './components/UI/DevBotAssistant';
import AuthPage from './components/Auth/AuthPage';
import { Grid, Network, Clock, BarChart3, Terminal, ShieldCheck, Settings as SettingsIcon } from 'lucide-react';
import './App.css';

const TICKER_LOGS = [
  'COGNITIVE SUB-ROUTINES OPERATING AT CRITICAL ACCELERATION...',
  'VAULT SECURITY ENCRYPT DETECTED ZERO DECAY INDICES...',
  'CALIBRATING NEURAL CONDUIT DECODER RESONANCE...',
  'SYNCHRONIZING EMPATHETIC CORE SYNAPSE MATRIX...',
  'SECURE AES-256 ISOLATION CHAMBER FULLY ENGAGED...',
  'INTERACTIVE CONNECTOME REBUILDING NODE VECTORS...'
];

const AppContent = () => {
  const { activeTab, setActiveTab } = useContext(MemoryContext);
  const { user, loading, logout } = useContext(AuthContext);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [tickerIndex, setTickerIndex] = useState(0);

  // Digital Cockpit Clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      setTimeStr(`${hh}:${mm}:${ss}`);

      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      setDateStr(d.toLocaleDateString('en-US', options).toUpperCase());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // System logs ticker loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_LOGS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // 1. Session Loading Splasher
  if (loading) {
    return (
      <div className="auth-matrix-viewport">
        <div className="hud-cyber-grid"></div>
        <div className="hud-matrix-logs hud-font" style={{ width: '360px', height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' }}>
          <div className="log-line">&gt; INITIATING COGNITIVE SECURE DECRYPTER...</div>
          <div className="log-line">&gt; SYNCHRONIZING WITH VAULT STORAGE LAYER...</div>
          <div className="log-line text-cyan animate-pulse">&gt; LINK SECURED. DECRYPTING CONNECTOMES...</div>
        </div>
      </div>
    );
  }

  // 2. Access matrix wall (Security authentication firewall)
  if (!user) {
    return <AuthPage />;
  }

  // Map tabs to correct component
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'map':
        return <MemoryMap />;
      case 'timeline':
        return <Timeline />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {/* 1. Futuristic Scanline Overlay */}
      <div className="hologram-overlay"></div>

      {/* 2. Top Cyber cockpit Header */}
      <header className="app-header">
        <div className="header-branding-box">
          <div className="app-logo-minimalist">
            <ShieldCheck size={20} className="text-cyan animate-pulse" style={{ filter: 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.5))' }} />
          </div>
          <div>
            <h2 className="app-title-hud hud-font">
              NEURAL VAULT
            </h2>
            <p className="app-subtitle-hud hud-font">MEMORY OPERATING SYSTEM // COGNITIVE MESH V3.8</p>
          </div>
        </div>

        {/* Diagnostic Scroll Ticker */}
        <div className="app-ticker-box">
          <Terminal size={14} className="ticker-icon" />
          <div className="ticker-text">
            {TICKER_LOGS[tickerIndex]}
          </div>
        </div>

        {/* Real-time Clock & Operator Identity Matrix */}
        <div className="header-identity-box">
          <div className="operator-profile hud-font">
            <span className="text-magenta">OPERATOR: {user.username.toUpperCase()}</span>
            <button className="logout-btn hud-font" onClick={logout}>[ PURGE SIGNATURE ]</button>
          </div>
          <div className="header-clock-hud">
            <span className="clock-time">{timeStr}</span>
            <span className="clock-date">{dateStr}</span>
          </div>
        </div>
      </header>

      {/* 3. Glowing Navigation Tab Matrix */}
      <nav className="navigation-tab-matrix">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <Grid size={14} />
          <span>DASHBOARD CORE</span>
        </button>
        
        <button
          onClick={() => setActiveTab('map')}
          className={`nav-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
        >
          <Network size={14} />
          <span>NEURAL MAP</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`nav-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
        >
          <Clock size={14} />
          <span>CHRONOS TIMELINE</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          <BarChart3 size={14} />
          <span>VAULT METRICS</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <SettingsIcon size={14} />
          <span>VAULT CONFIG</span>
        </button>
      </nav>

      {/* 4. Active Cockpit Screen */}
      <main className="app-main-workspace">
        {renderActiveComponent()}
      </main>

      {/* 5. Centralized Holographic Decrypt Chamber Modal & DevBot AI Chatbot */}
      <MemoryModal />
      <DevBotAssistant />

      {/* 6. Footer Diagnostics */}
      <footer className="app-footer">
        <span>© 2026 NEURAL VAULT SYSTEM INC. // ALL RIGHTS RESERVED</span>
        <span className="footer-secure hud-font">
          <ShieldCheck size={12} /> SECURE ENCRYPTED CONNECTIVITY
        </span>
      </footer>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <MemoryProvider>
        <AppContent />
      </MemoryProvider>
    </AuthProvider>
  );
}

export default App;
