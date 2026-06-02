import React, { useContext, useState } from 'react';
import { MemoryContext } from '../../context/MemoryContext';
import { Clock, Calendar, ArrowRight, ShieldCheck, Tag, Eye } from 'lucide-react';
import './Timeline.css';

const Timeline = () => {
  const { notes, setSelectedNote } = useContext(MemoryContext);

  // Sort notes by date descending
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd} // ${hh}:${min}`;
  };

  const getMoodColor = (mood) => {
    switch (mood.toLowerCase()) {
      case 'calm': return 'var(--mood-calm)';
      case 'energetic': return 'var(--mood-energetic)';
      case 'euphoric': return 'var(--mood-euphoric)';
      case 'cyber': return 'var(--mood-cyber)';
      case 'focused': return 'var(--mood-focused)';
      default: return '#FFFFFF';
    }
  };

  return (
    <div className="timeline-container cyber-panel">
      <div className="timeline-header hud-font">
        <div className="header-title">
          <Clock className="text-cyan pulse-glow" size={16} />
          <span>CHRONOLOGICAL CHRONOS LOG</span>
        </div>
        <span className="results-count">RETRIEVED TIMESTAMPS: {sortedNotes.length}</span>
      </div>

      {sortedNotes.length > 0 ? (
        <div className="timeline-rail-wrapper">
          {/* Central neon glowing rail */}
          <div className="timeline-glow-rail"></div>

          <div className="timeline-items-list">
            {sortedNotes.map((note, index) => {
              const nodeColor = getMoodColor(note.mood);
              
              return (
                <div 
                  key={note.id} 
                  className="timeline-node-card"
                  onClick={() => setSelectedNote(note)}
                >
                  {/* Glowing vertical connector dot */}
                  <div 
                    className="timeline-node-dot"
                    style={{ 
                      backgroundColor: nodeColor,
                      boxShadow: `0 0 12px ${nodeColor}`
                    }}
                  >
                    <span className="pulse-ripple" style={{ borderColor: nodeColor }}></span>
                  </div>

                  {/* Timestamp HUD Label */}
                  <div className="timeline-timestamp hud-font" style={{ color: nodeColor }}>
                    <Calendar size={10} />
                    <span>{formatDate(note.createdAt)}</span>
                  </div>

                  {/* Content Strip */}
                  <div className="timeline-content-strip cyber-panel">
                    <div className="strip-top">
                      <div className="strip-metadata">
                        <span className="strip-category hud-font">{note.category}</span>
                        <span 
                          className="mood-indicator-dot" 
                          style={{ backgroundColor: nodeColor }}
                        ></span>
                        <span className="hud-font mood-label">{note.mood.toUpperCase()}</span>
                      </div>
                      <span className="strip-node-id hud-font">NODE::{note.id.substring(4, 9).toUpperCase()}</span>
                    </div>

                    <h3 className="strip-title hud-font">{note.title}</h3>
                    
                    <p className="strip-body">
                      {note.content.length > 180 ? `${note.content.substring(0, 180)}...` : note.content}
                    </p>

                    <div className="strip-footer">
                      <div className="strip-tags">
                        <Tag size={10} className="tag-icon" />
                        {note.tags.map(tag => (
                          <span key={tag} className="strip-tag hud-font">#{tag}</span>
                        ))}
                      </div>
                      
                      <button 
                        className="strip-decrypt-btn hud-font"
                        style={{ color: nodeColor }}
                      >
                        DECRYPT MEMORY <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="timeline-empty-state">
          <ShieldCheck size={48} className="text-muted spin-slow" />
          <h3 className="hud-font">NO CHRONOLOGY DETECTED</h3>
          <p>ESTABLISH NEW MEMORIES TO ENGAGE THE KNOWLEDGE CHRONOS TRACKER.</p>
        </div>
      )}
    </div>
  );
};

export default Timeline;
