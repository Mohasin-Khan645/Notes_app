import React, { useContext, useState } from 'react';
import { MemoryContext } from '../../context/MemoryContext';
import { Eye, Trash2, Calendar, Tag, Shield, Edit3, X, Check } from 'lucide-react';
import './NoteCapsule.css';

const NoteCapsule = ({ note, index }) => {
  const { setSelectedNote } = useContext(MemoryContext);
  const [isHovered, setIsHovered] = useState(false);

  const moodClass = `mood-${note.mood.toLowerCase()}`;
  
  // Custom orbital animation delays
  const levitationDelay = `${(index * 0.4).toFixed(1)}s`;

  return (
    <>
      {/* Floating Holographic Capsule */}
      <div 
        className={`memory-capsule-orb ${moodClass} levitate`}
        style={{ animationDelay: levitationDelay }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setSelectedNote(note)}
      >
        {/* Orbital Ring Effects */}
        <div className="orb-ring-outer"></div>
        <div className="orb-ring-inner"></div>
        
        {/* Interactive Holographic Core */}
        <div className="orb-core">
          <div className="orb-header hud-font">
            <span className="orb-category">{note.category}</span>
            <span className="orb-mood-indicator"></span>
          </div>

          <h3 className="orb-title hud-font">{note.title}</h3>
          
          <p className="orb-preview">
            {note.content.length > 90 ? `${note.content.substring(0, 90)}...` : note.content}
          </p>

          <div className="orb-footer">
            <div className="orb-tags">
              {note.tags.slice(0, 2).map(tag => (
                <span key={tag} className="orb-tag hud-font">#{tag}</span>
              ))}
              {note.tags.length > 2 && <span className="orb-tag-more">+{note.tags.length - 2}</span>}
            </div>
            <span className="orb-date hud-font">{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Ambient Glow Aura */}
        <div className="orb-aura"></div>
      </div>
    </>
  );
};

export default NoteCapsule;
