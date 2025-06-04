const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  department: {
    type: String,
    required: [true, 'Please select a department'],
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', eventSchema);