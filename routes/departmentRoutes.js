const express = require('express');
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addTeam,
  updateTeam,
  deleteTeam,
} = require('../controllers/departmentController');

const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const Department = require('../models/Department');

const router = express.Router();

router
  .route('/')
  .get(advancedResults(Department), getDepartments)
  .post(protect, authorize('admin'), createDepartment);

router
  .route('/:id')
  .get(getDepartment)
  .put(protect, authorize('admin'), updateDepartment)
  .delete(protect, authorize('admin'), deleteDepartment);

router
  .route('/:id/teams')
  .post(protect, authorize('admin'), addTeam);

router
  .route('/:id/teams/:teamId')
  .put(protect, authorize('admin'), updateTeam)
  .delete(protect, authorize('admin'), deleteTeam);

module.exports = router;