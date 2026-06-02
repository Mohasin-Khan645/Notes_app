import React, { useContext } from 'react';
import { MemoryContext } from '../../context/MemoryContext';
import { Search, Hash, Cpu, Sparkles } from 'lucide-react';
import './SearchPanel.css';

const CATEGORIES = ['All', 'Core Memory', 'Tech Spec', 'Cyberdeck', 'Intel', 'Idea'];
const MOODS = ['All', 'Calm', 'Energetic', 'Euphoric', 'Cyber', 'Focused'];

const SearchPanel = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedMood,
    setSelectedMood,
    filteredNotes
  } = useContext(MemoryContext);

  return (
    <div className="search-panel-container cyber-panel">
      <div className="search-header hud-font">
        <span className="glow-dot"></span>
        KNOWLEDGE RETRIEVAL CORE
        <span className="results-count">FOUND: {filteredNotes.length} CAPSULES</span>
      </div>

      <div className="search-bar-wrapper">
        <Search className="search-icon neon-glow-text" size={18} />
        <input
          type="text"
          placeholder="SEARCH SYNAPSE PATHWAYS OR MEMORY TAGS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="scanner-line"></div>
      </div>

      <div className="filters-section">
        {/* Category Filters */}
        <div className="filter-group">
          <label className="hud-font group-label"><Cpu size={12} /> CATEGORIES</label>
          <div className="filter-buttons">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mood Filters */}
        <div className="filter-group">
          <label className="hud-font group-label"><Sparkles size={12} /> NEURAL MOOD</label>
          <div className="filter-buttons">
            {MOODS.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`filter-btn mood-btn mood-${mood.toLowerCase()} ${selectedMood === mood ? 'active' : ''}`}
              >
                <span className={`mood-dot mood-${mood.toLowerCase()}`}></span>
                {mood}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
