const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please add last name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
  },
  universityId: {
    type: String,
  },
  studyLevel: {
    type: String,
    enum: ['L1', 'L2', 'L3', 'M1', 'M2', 'Doctorate'],
  },
  department: {
    type: String,
    required: [true, 'Please select a department'],
  },
  team: {
    type: String,
  },
  skills: {
    type: String,
  },
  motivation: {
    type: String,
    required: [true, 'Please add your motivation'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Member', memberSchema);