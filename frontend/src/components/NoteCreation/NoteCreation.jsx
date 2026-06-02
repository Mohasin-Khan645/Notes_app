import React, { useState, useContext } from 'react';
import { MemoryContext } from '../../context/MemoryContext';
import { Plus, Check, RotateCcw } from 'lucide-react';
import './NoteCreation.css';

const CATEGORIES = ['Core Memory', 'Tech Spec', 'Cyberdeck', 'Intel', 'Idea'];
const MOODS = ['Calm', 'Energetic', 'Euphoric', 'Cyber', 'Focused'];

const NoteCreation = () => {
  const { createNote } = useContext(MemoryContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Idea');
  const [tags, setTags] = useState('');
  const [mood, setMood] = useState('Calm');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createNote({
      title,
      content,
      category,
      tags,
      mood
    });

    // Reset Form
    setTitle('');
    setContent('');
    setCategory('Idea');
    setTags('');
    setMood('Calm');

    // Trigger futuristic completion animation
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="creation-panel cyber-panel">
      <div className="panel-header hud-font">
        <span className="glow-dot purple"></span>
        ESTABLISH NEURAL UPLINK
      </div>

      <form onSubmit={handleSubmit} className="creation-form">
        {/* Title Input */}
        <div className="form-group">
          <input
            type="text"
            placeholder="MEMORY TITLE..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="hud-font text-input title-input"
          />
        </div>

        {/* Content Area */}
        <div className="form-group">
          <textarea
            placeholder="RECORD SYNAPSE DATA stream here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            className="text-input content-input"
          />
        </div>

        <div className="form-row">
          {/* Category Dropdown */}
          <div className="form-group flex-1">
            <label className="hud-font select-label">SECTOR CODE</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="cyber-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Mood Selector */}
          <div className="form-group flex-1">
            <label className="hud-font select-label">SYNAPSE STATE (MOOD)</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className={`cyber-select mood-select mood-${mood.toLowerCase()}`}
            >
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="form-group">
          <input
            type="text"
            placeholder="TAGS (COMMA SEPARATED, E.G., NEURAL, SPEC, INTEL)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="text-input tags-input"
          />
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="submit"
            className={`cyber-button ${isSuccess ? 'accent' : ''}`}
            disabled={!title.trim() || !content.trim()}
          >
            {isSuccess ? (
              <>
                <Check size={16} /> UPLINK COMPLETED
              </>
            ) : (
              <>
                <Plus size={16} /> COMMIT TO VAULT
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteCreation;
