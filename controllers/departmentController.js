const Department = require('../models/Department');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Get all departments
// @route   GET /api/v1/departments
// @access  Public
exports.getDepartments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single department
// @route   GET /api/v1/departments/:id
// @access  Public
exports.getDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    return next(
      new ErrorResponse(`Department not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: department,
  });
});

// @desc    Create new department
// @route   POST /api/v1/departments
// @access  Private/Admin
exports.createDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.create(req.body);

  res.status(201).json({
    success: true,
    data: department,
  });
});

// @desc    Update department
// @route   PUT /api/v1/departments/:id
// @access  Private/Admin
exports.updateDepartment = asyncHandler(async (req, res, next) => {
  let department = await Department.findById(req.params.id);

  if (!department) {
    return next(
      new ErrorResponse(`Department not found with id of ${req.params.id}`, 404)
    );
  }

  department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: department,
  });
});

// @desc    Delete department
// @route   DELETE /api/v1/departments/:id
// @access  Private/Admin
exports.deleteDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    return next(
      new ErrorResponse(`Department not found with id of ${req.params.id}`, 404)
    );
  }

  await department.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Add team to department
// @route   POST /api/v1/departments/:id/teams
// @access  Private/Admin
exports.addTeam = asyncHandler(async (req, res, next) => {
  let department = await Department.findById(req.params.id);

  if (!department) {
    return next(
      new ErrorResponse(`Department not found with id of ${req.params.id}`, 404)
    );
  }

  department.teams.push(req.body);
  await department.save();

  res.status(200).json({
    success: true,
    data: department,
  });
});

// @desc    Update team in department
// @route   PUT /api/v1/departments/:id/teams/:teamId
// @access  Private/Admin
exports.updateTeam = asyncHandler(async (req, res, next) => {
  let department = await Department.findById(req.params.id);

  if (!department) {
    return next(
      new ErrorResponse(`Department not found with id of ${req.params.id}`, 404)
    );
  }

  const teamIndex = department.teams.findIndex(
    (team) => team._id.toString() === req.params.teamId
  );

  if (teamIndex === -1) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.teamId}`, 404)
    );
  }

  department.teams[teamIndex] = {
    ...department.teams[teamIndex].toObject(),
    ...req.body,
  };

  await department.save();

  res.status(200).json({
    success: true,
    data: department,
  });
});

// @desc    Delete team from department
// @route   DELETE /api/v1/departments/:id/teams/:teamId
// @access  Private/Admin
exports.deleteTeam = asyncHandler(async (req, res, next) => {
  let department = await Department.findById(req.params.id);

  if (!department) {
    return next(
      new ErrorResponse(`Department not found with id of ${req.params.id}`, 404)
    );
  }

  department.teams = department.teams.filter(
    (team) => team._id.toString() !== req.params.teamId
  );

  await department.save();

  res.status(200).json({
    success: true,
    data: department,
  });
});