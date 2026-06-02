import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const MemoryContext = createContext();

import { API_NOTES_URL as API_BASE_URL } from '../config';

const DEFAULT_MEMORIES = [
  {
    id: 'mem-1',
    _id: 'mem-1',
    title: 'Quantum Cryptography Deck',
    content: 'Secured a handshake with the neo-tokyo sub-servers. Encryption algorithm utilizes high-dimensional spin particles. Decryption keys rotate every 3.5ms. The firmware requires patch 1.89 to prevent memory leaks in the primary buffer.',
    category: 'Tech Spec',
    mood: 'Focused',
    tags: ['cyberdeck', 'crypto', 'quantum', 'tokyo'],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: 'mem-2',
    _id: 'mem-2',
    title: 'DevBot Synaptic Core Upload',
    content: 'Synchronizing emotional responsive subroutines with the neural node matrix. Core architecture shows 94% compatibility. The remaining 6% is affected by cognitive noise from memory sector 0x7E. Initiating ambient calming soundwaves to stabilize synapses.',
    category: 'Core Memory',
    mood: 'Calm',
    tags: ['devbot', 'synapse', 'neural', 'ai'],
    createdAt: new Date(Date.now() - 3600000 * 24 * 1.5).toISOString()
  },
  {
    id: 'mem-3',
    _id: 'mem-3',
    title: 'Mega-Corp Cybernetic Breach',
    content: 'Discovered a back-door port in the Arasaka sub-network gateway during the security audit. Cyber-deck logged minor alert. Downloaded raw schematic diagrams for the Mark-IV neural interface module. Safe to decrypt in isolation chamber.',
    category: 'Intel',
    mood: 'Cyber',
    tags: ['breach', 'intel', 'netrunner', 'arasaka'],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export const MemoryProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMood, setSelectedMood] = useState('All');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dbConnected, setDbConnected] = useState(false);

  // Helper to ensure notes have both id and _id fields normalized
  const normalizeNotes = (data) => {
    return data.map(note => ({
      ...note,
      id: note.id || note._id,
      _id: note._id || note.id
    }));
  };

  // 1. Fetch memories from Backend database
  const fetchMemories = async () => {
    if (!token) {
      setNotes([]);
      return;
    }

    try {
      const res = await fetch(API_BASE_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('API server returned error status');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setNotes(normalizeNotes(data));
        setDbConnected(true);
      }
    } catch (err) {
      console.warn('[MemoryContext] REST API conduit unreachable. Reverting to sandbox local cache.', err.message);
      setDbConnected(false);
      
      // Fallback to local storage caching (scoped to individual operator token footprint)
      const cached = localStorage.getItem(`neural_vault_memories_${token.substring(0, 15)}`);
      if (cached) {
        setNotes(normalizeNotes(JSON.parse(cached)));
      } else {
        // Fallback default starter memories for brand new users
        setNotes(normalizeNotes(DEFAULT_MEMORIES));
      }
    }
  };

  // Sync fetches on mount and token variations
  useEffect(() => {
    if (token) {
      fetchMemories();
      const interval = setInterval(fetchMemories, 10000); // sync every 10s
      return () => clearInterval(interval);
    } else {
      setNotes([]);
    }
  }, [token]);

  // Save to local storage for double safety caching
  useEffect(() => {
    if (token && notes && notes.length > 0) {
      localStorage.setItem(`neural_vault_memories_${token.substring(0, 15)}`, JSON.stringify(notes));
    }
  }, [notes, token]);

  // 2. CRUD: CREATE NOTE
  const createNote = async (newNote) => {
    if (!token) return;

    // If DB is offline, handle locally
    if (!dbConnected) {
      const localNote = {
        ...newNote,
        id: `mem-${Date.now()}`,
        _id: `mem-${Date.now()}`,
        createdAt: new Date().toISOString(),
        tags: typeof newNote.tags === 'string' 
          ? newNote.tags.split(',').map(t => t.trim()).filter(Boolean)
          : newNote.tags
      };
      setNotes(prev => [localNote, ...prev]);
      return localNote;
    }

    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newNote,
          tags: typeof newNote.tags === 'string'
            ? newNote.tags.split(',').map(t => t.trim()).filter(Boolean)
            : newNote.tags
        })
      });
      if (!res.ok) throw new Error('Failed to post capsule');
      const data = await res.json();
      
      const normalized = { ...data, id: data._id };
      setNotes(prev => [normalized, ...prev]);
      return normalized;
    } catch (err) {
      console.error('[MemoryContext] Error posting note to DB', err);
    }
  };

  // 3. CRUD: UPDATE NOTE
  const updateNote = async (id, updatedFields) => {
    if (!token) return;

    const formattedTags = typeof updatedFields.tags === 'string'
      ? updatedFields.tags.split(',').map(t => t.trim()).filter(Boolean)
      : updatedFields.tags;

    if (!dbConnected) {
      setNotes(prev =>
        prev.map(note => note.id === id ? { ...note, ...updatedFields, tags: formattedTags } : note)
      );
      if (selectedNote && (selectedNote.id === id || selectedNote._id === id)) {
        setSelectedNote(prev => ({ ...prev, ...updatedFields, tags: formattedTags }));
      }
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...updatedFields,
          tags: formattedTags
        })
      });
      if (!res.ok) throw new Error('Failed to update capsule');
      const data = await res.json();

      const normalized = { ...data, id: data._id };
      setNotes(prev => prev.map(note => (note._id === id || note.id === id) ? normalized : note));
      
      if (selectedNote && (selectedNote._id === id || selectedNote.id === id)) {
        setSelectedNote(normalized);
      }
      return normalized;
    } catch (err) {
      console.error('[MemoryContext] Error updating note', err);
    }
  };

  // 4. CRUD: DELETE NOTE
  const deleteNote = async (id) => {
    if (!token) return;

    if (!dbConnected) {
      setNotes(prev => prev.filter(note => note.id !== id));
      if (selectedNote && (selectedNote.id === id || selectedNote._id === id)) {
        setSelectedNote(null);
      }
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to purge capsule');

      setNotes(prev => prev.filter(note => note._id !== id && note.id !== id));
      if (selectedNote && (selectedNote._id === id || selectedNote.id === id)) {
        setSelectedNote(null);
      }
    } catch (err) {
      console.error('[MemoryContext] Error deleting note', err);
    }
  };

  // Get all unique tags
  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags || []))
  );

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesMood = selectedMood === 'All' || note.mood === selectedMood;

    return matchesSearch && matchesCategory && matchesMood;
  });

  return (
    <MemoryContext.Provider
      value={{
        notes,
        filteredNotes,
        selectedNote,
        setSelectedNote,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedMood,
        setSelectedMood,
        activeTab,
        setActiveTab,
        allTags,
        createNote,
        updateNote,
        deleteNote,
        dbConnected
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
};
