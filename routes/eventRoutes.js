const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const Event = require('../models/Event');

const router = express.Router();

router
  .route('/')
  .get(advancedResults(Event), getEvents)
  .post(protect, authorize('admin', 'moderator'), createEvent);

router
  .route('/:id')
  .get(getEvent)
  .put(protect, authorize('admin', 'moderator'), updateEvent)
  .delete(protect, authorize('admin', 'moderator'), deleteEvent);

module.exports = router;