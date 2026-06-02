import React, { useContext, useState, useEffect } from 'react';
import { MemoryContext } from '../../context/MemoryContext';
import { X, Trash2, Calendar, Tag, Shield, Edit3, Check } from 'lucide-react';
import '../NoteCapsule/NoteCapsule.css'; // sharing capsule stylings

const MemoryModal = () => {
  const { selectedNote, setSelectedNote, deleteNote, updateNote } = useContext(MemoryContext);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit Form Fields
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editMood, setEditMood] = useState('');
  const [editTags, setEditTags] = useState('');

  // Sync edit form fields when selectedNote changes
  useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
      setEditCategory(selectedNote.category);
      setEditMood(selectedNote.mood);
      setEditTags(selectedNote.tags.join(', '));
      setIsEditing(false); // reset edit mode
    }
  }, [selectedNote]);

  if (!selectedNote) return null;

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} @ ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleClose = () => {
    setSelectedNote(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteNote(selectedNote.id);
    handleClose();
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    updateNote(selectedNote.id, {
      title: editTitle,
      content: editContent,
      category: editCategory,
      mood: editMood,
      tags: editTags
    });
    setIsEditing(false);
  };

  return (
    <div className="hologram-modal-overlay" onClick={handleClose}>
      <div className="hologram-modal-wrapper cyber-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={18} />
        </button>

        {/* Neural Uplink Banner */}
        <div className="modal-banner hud-font">
          <span className="banner-pulse"></span>
          SECURE DECRYPT CHAMBER - MEMORY // {selectedNote.id.toUpperCase()}
        </div>

        {!isEditing ? (
          /* Display Mode */
          <div className="modal-display-content">
            <div className="modal-meta-row">
              <div className={`mood-badge mood-${selectedNote.mood.toLowerCase()}`}>
                {selectedNote.mood} STATE
              </div>
              <div className="category-badge hud-font">
                SECTOR: {selectedNote.category.toUpperCase()}
              </div>
            </div>

            <h2 className="modal-title hud-font">{selectedNote.title}</h2>

            <div className="modal-content-scroller">
              <p className="modal-body-text">{selectedNote.content}</p>
            </div>

            <div className="modal-tags-row">
              <Tag size={12} className="tag-icon" />
              {selectedNote.tags.map(tag => (
                <span key={tag} className="detail-tag hud-font">#{tag}</span>
              ))}
            </div>

            <div className="modal-footer-meta hud-font">
              <span className="meta-item">
                <Calendar size={12} /> RECORDED: {formatDate(selectedNote.createdAt)}
              </span>
              <span className="meta-item text-green">
                <Shield size={12} /> ENCRYPTED // AES-256
              </span>
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => setIsEditing(true)} 
                className="cyber-button secondary"
              >
                <Edit3 size={14} /> DECRYPT & EDIT
              </button>
              <button onClick={handleDelete} className="cyber-button accent">
                <Trash2 size={14} /> PURGE SYSTEM
              </button>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSaveChanges} className="modal-edit-form">
            <div className="form-group">
              <label className="hud-font select-label">MEMORY TITLE</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="hud-font text-input"
              />
            </div>

            <div className="form-group">
              <label className="hud-font select-label">SYNAPSE DATA STREAM</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
                rows={6}
                className="text-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="hud-font select-label">SECTOR CODE</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="cyber-select"
                >
                  {['Core Memory', 'Tech Spec', 'Cyberdeck', 'Intel', 'Idea'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group flex-1">
                <label className="hud-font select-label">SYNAPSE STATE</label>
                <select
                  value={editMood}
                  onChange={(e) => setEditMood(e.target.value)}
                  className={`cyber-select mood-select mood-${editMood.toLowerCase()}`}
                >
                  {['Calm', 'Energetic', 'Euphoric', 'Cyber', 'Focused'].map((m) => (
                    <option key={m} value={m}>
                      {m.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="hud-font select-label">TAGS (COMMA SEPARATED)</label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="text-input"
              />
            </div>

            <div className="modal-actions">
              <button type="submit" className="cyber-button">
                <Check size={14} /> COMMIT REVISION
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="cyber-button secondary">
                CANCEL
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MemoryModal;
