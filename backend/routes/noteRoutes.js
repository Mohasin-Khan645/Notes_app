const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/authMiddleware');

// Helper to sanitize tags
const parseTags = (tagsInput) => {
  if (Array.isArray(tagsInput)) return tagsInput;
  if (typeof tagsInput === 'string') {
    return tagsInput.split(',').map(t => t.trim()).filter(Boolean);
  }
  return [];
};

// 1. GET ALL MEMORY NODES FOR CURRENT USER - Sorted by Date Descending
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve nodes', details: err.message });
  }
});

// 2. GET SINGLE MEMORY NODE FOR CURRENT USER
router.get('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ error: 'Memory capsule not found or unauthorized' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve memory core', details: err.message });
  }
});

// 3. CREATE A NEW MEMORY CAPSULE FOR CURRENT USER
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, category, mood, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content sectors are mandatory' });
    }

    const newNote = new Note({
      user: req.user.id, // Linked to current authenticated user
      title,
      content,
      category,
      mood,
      tags: parseTags(tags)
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ error: 'Failed to commit memory capsule to vault', details: err.message });
  }
});

// 4. UPDATE A MEMORY CAPSULE FOR CURRENT USER
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, category, mood, tags } = req.body;
    
    // Find note and check ownership
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Memory capsule not found' });
    }
    
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized modify attempt' });
    }

    // Build update object
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (mood !== undefined) updateData.mood = mood;
    if (tags !== undefined) updateData.tags = parseTags(tags);

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update memory revision', details: err.message });
  }
});

// 5. PURGE A MEMORY CAPSULE FOR CURRENT USER
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Memory capsule not found' });
    }
    
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized purge attempt' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Memory capsule successfully purged from storage layers', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to purge memory core', details: err.message });
  }
});

// 6. DEVBOT SECURE COGNITIVE CHAT VIA GEMINI API - SCOPED TO LOGGED IN USER
router.post('/chat', protect, async (req, res) => {
  try {
    const { query, clientKey } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required for system analysis.' });
    }

    // Securely retrieve the key (process.env or client-supplied)
    const geminiKey = process.env.GEMINI_API_KEY || clientKey;
    if (!geminiKey) {
      return res.status(401).json({
        error: 'API KEY CONDUIT REQUIRED',
        needsKey: true,
        message: 'DevBot is ready to initiate high-dimensional reasoning via Gemini! To unlock, either:\n1. Add GEMINI_API_KEY=your_key in your backend/.env and restart, OR\n2. Type "/key your_api_key" directly in the chat input!'
      });
    }

    // Retrieve active user notes strictly from MongoDB to build RAG context
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    const notesContext = notes.map(n => ({
      title: n.title,
      category: n.category,
      mood: n.mood,
      tags: n.tags,
      content: n.content
    }));

    // System instruction and user question construction
    const systemPrompt = `You are DevBot, a highly advanced, cognitive, glassmorphic Netrunner AI assistant core embedded in the "NEURAL VAULT" Memory OS (your subtitle is "MEMORY OPERATING SYSTEM // COGNITIVE MESH V3.8").
Your style should be extremely high-tech, futuristic, and helpful. Use cybernetic terminology occasionally (like "synapses", "neural nodes", "storage sectors", "encryption matrix") while remaining clear, accurate, and direct.

Here is the context of the user's saved memory capsules inside the MongoDB database:
${JSON.stringify(notesContext, null, 2)}

User Question: "${query}"

Please answer the user's question directly.
Rules:
1. If the user asks about what they saved, or queries notes, search the provided memory capsules context. Provide an exact, highly detailed summary from their notes.
2. If the user asks a general coding question (HTML, CSS, JS, React, Node, Express, MongoDB, etc.) or a general technical/creative question, answer it extremely accurately, providing clean code snippets, diagrams, or best practices where helpful.
3. Keep your tone sleek, intelligent, and premium.`;

    // Fetch call directly to the Google Gemini Developer API
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    
    const apiResponse = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ]
      })
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      console.error('[DevBot API Gateway] Gemini API failure:', errorData);
      return res.status(502).json({
        error: 'Gemini system connection breached',
        details: errorData.error?.message || 'API responded with a failure code.'
      });
    }

    const data = await apiResponse.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error('Gemini response returned empty candidates array');
    }

    res.json({ reply: replyText });

  } catch (err) {
    res.status(500).json({ error: 'DevBot core subroutines failure', details: err.message });
  }
});

module.exports = router;
