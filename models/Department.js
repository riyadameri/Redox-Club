const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a department name'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  teams: [{
    name: String,
    description: String,
  }],
  icon: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Department', departmentSchema);