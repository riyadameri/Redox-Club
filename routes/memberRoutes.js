const express = require('express');
const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  approveMember,
  rejectMember,
} = require('../controllers/memberController');

const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const Member = require('../models/Member');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin', 'moderator'), advancedResults(Member), getMembers)
  .post(createMember);

router
  .route('/:id')
  .get(protect, authorize('admin', 'moderator'), getMember)
  .put(protect, authorize('admin', 'moderator'), updateMember)
  .delete(protect, authorize('admin'), deleteMember);

router
  .route('/:id/approve')
  .put(protect, authorize('admin', 'moderator'), approveMember);

router
  .route('/:id/reject')
  .put(protect, authorize('admin', 'moderator'), rejectMember);

module.exports = router;