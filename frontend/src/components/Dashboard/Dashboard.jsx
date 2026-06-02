import React, { useContext, useEffect, useState } from 'react';
import { MemoryContext } from '../../context/MemoryContext';
import NoteCapsule from '../NoteCapsule/NoteCapsule';
import NoteCreation from '../NoteCreation/NoteCreation';
import SearchPanel from '../Search/SearchPanel';
import { Cpu, Database, Activity, RefreshCw } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { filteredNotes, notes } = useContext(MemoryContext);
  const [greetingTime, setGreetingTime] = useState('');
  const [temperature, setTemperature] = useState(31.2);

  // Dynamic system greeting & temperature simulation
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreetingTime('MORNING');
    else if (hours < 18) setGreetingTime('AFTERNOON');
    else setGreetingTime('EVENING');

    const interval = setInterval(() => {
      setTemperature((prev) => +(prev + (Math.random() - 0.5) * 0.4).toFixed(1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Compute stat counts
  const totalNotes = notes.length;
  const categoriesCount = new Set(notes.map(n => n.category)).size;
  const uniqueTags = new Set(notes.flatMap(n => n.tags)).size;

  return (
    <div className="dashboard-wrapper">
      
      {/* 1. TOP DIAGNOSTICS HUD */}
      <div className="system-hud-bar hud-font">
        <div className="hud-metric">
          <Cpu size={12} className="neon-glow-text" />
          <span>SYSTEM CORE: <strong className="text-cyan">NEURAL OS v3.8</strong></span>
        </div>
        <div className="hud-metric">
          <Activity size={12} className="text-magenta" />
          <span>SYNAPSE TEMP: <strong className="text-magenta">{temperature}°C</strong></span>
        </div>
        <div className="hud-metric">
          <Database size={12} className="text-green" />
          <span>VAULT CAPACITY: <strong className="text-green">{totalNotes} / 256 Nodes</strong></span>
        </div>
        <div className="hud-metric sync-indicator">
          <span className="sync-pulse"></span>
          <span>NET CONNECTIONS: <strong className="text-cyan">ONLINE</strong></span>
        </div>
      </div>

      {/* 2. DYNAMIC HERO BRANDING SECTION */}
      <section className="hero-branding cyber-panel">
        <div className="branding-glow-bg"></div>
        
        <div className="branding-logo-box">
          <svg className="neural-emblem spin-slow" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#00E5FF" strokeWidth="1" strokeDasharray="3, 5" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="15, 3" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#FF4DFF" strokeWidth="0.8" strokeDasharray="5, 8" />
            <polygon points="50,20 60,40 80,50 60,60 50,80 40,60 20,50 40,40" fill="none" stroke="#00E5FF" strokeWidth="1" />
            <circle cx="50" cy="50" r="5" fill="#FFFFFF" className="pulse-glow" />
          </svg>
        </div>

        <div className="branding-content">
          <div className="hud-font category-indicator text-cyan">INTEL PROTOCOL INITIATED</div>
          <h1 className="neural-vault-title">NEURAL VAULT</h1>
          <p className="branding-tagline hud-font">"STORE THOUGHTS. BUILD INTELLIGENCE."</p>
          <p className="branding-welcome-msg">
            SYSTEM BOOT: SECURE ENCRYPTED UPLINK ESTABLISHED. GOOD {greetingTime}, OPERATOR. ALL COGNITIVE MEMORIES RETRIEVED FROM SUB-LAYERS.
          </p>
        </div>

        {/* 3. HERO STATISTICS BLOCKS */}
        <div className="hud-stats-grid">
          <div className="stat-card">
            <span className="stat-label hud-font">TOTAL MEMORIES</span>
            <span className="stat-value text-cyan">{totalNotes}</span>
            <span className="stat-sub hud-font">ACTIVE ORBS</span>
          </div>
          <div className="stat-card">
            <span className="stat-label hud-font">SECTORS CODE</span>
            <span className="stat-value text-purple">{categoriesCount}</span>
            <span className="stat-sub hud-font">CATEGORIES</span>
          </div>
          <div className="stat-card">
            <span className="stat-label hud-font">TAG SYNPASES</span>
            <span className="stat-value text-magenta">{uniqueTags}</span>
            <span className="stat-sub hud-font">CONNECTED PATHS</span>
          </div>
        </div>
      </section>

      {/* 4. MAIN WORKSPACE */}
      <div className="workspace-grid">
        {/* Left Control Column */}
        <div className="control-column">
          <SearchPanel />
          <NoteCreation />
        </div>

        {/* Right Memory Capsules Column */}
        <div className="capsules-column">
          <div className="capsules-header hud-font">
            <h3>RETRIEVED CAPSULES ({filteredNotes.length})</h3>
            <span className="hologram-indicator"></span>
          </div>

          {filteredNotes.length > 0 ? (
            <div className="capsules-grid">
              {filteredNotes.map((note, index) => (
                <NoteCapsule key={note.id} note={note} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty-capsules-state cyber-panel">
              <RefreshCw className="empty-icon spin-slow text-cyan" size={48} />
              <h3 className="hud-font text-cyan">UPLINK EMPTY</h3>
              <p>NO MEMORY CAPSULES RECORDED IN THIS SPECIFIC COGNITIVE FREQUENCY. UPDATE FILTERS OR ESTABLISH A NEW NEURAL TRANSCRIPTION.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
