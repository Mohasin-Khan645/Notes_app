const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Memory Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Synapse Data Stream (Content) is required']
  },
  category: {
    type: String,
    required: [true, 'Sector Code (Category) is required'],
    enum: ['Core Memory', 'Tech Spec', 'Cyberdeck', 'Intel', 'Idea'],
    default: 'Idea'
  },
  tags: {
    type: [String],
    default: []
  },
  mood: {
    type: String,
    required: [true, 'Synapse State (Mood) is required'],
    enum: ['Calm', 'Energetic', 'Euphoric', 'Cyber', 'Focused'],
    default: 'Calm'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', NoteSchema);
