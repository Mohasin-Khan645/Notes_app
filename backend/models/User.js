const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username code designation is mandatory'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must comprise at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Operator email uplink coordinate is mandatory'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Uplink coordinate must be a valid email format'
    ]
  },
  password: {
    type: String,
    required: [true, 'Security decryption code is mandatory'],
    minlength: [6, 'Decryption code must comprise at least 6 characters']
  }
}, {
  timestamps: true
});

// Pre-save Hook: Salting and Hashing Encryption
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance Method: Verifies password match
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
