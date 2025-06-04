const Member = require('../models/Member');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const sendEmail = require('../utils/sendEmail');
const telegramBot = require('../utils/telegramBot');

// @desc    Get all members
// @route   GET /api/v1/members
// @access  Private/Admin
exports.getMembers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single member
// @route   GET /api/v1/members/:id
// @access  Private/Admin
exports.getMember = asyncHandler(async (req, res, next) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    return next(
      new ErrorResponse(`Member not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: member,
  });
});

// @desc    Create new member
// @route   POST /api/v1/members
// @access  Public
exports.createMember = asyncHandler(async (req, res, next) => {
  const member = await Member.create(req.body);

  // Send notification to Telegram
  const message = `New Member Application:\n\nName: ${member.firstName} ${member.lastName}\nEmail: ${member.email}\nDepartment: ${member.department}\nTeam: ${member.team || 'Not specified'}`;
  
  try {
    await telegramBot.sendMessage(message);
  } catch (err) {
    console.error('Telegram notification failed:', err);
  }

  // Send confirmation email
  const emailMessage = `Thank you for applying to Redox Club! We have received your application for the ${member.department} department. We will review your application and get back to you soon.`;

  try {
    await sendEmail({
      email: member.email,
      subject: 'Redox Club Application Received',
      message: emailMessage,
    });
  } catch (err) {
    console.error('Email sending failed:', err);
  }

  res.status(201).json({
    success: true,
    data: member,
  });
});

// @desc    Update member
// @route   PUT /api/v1/members/:id
// @access  Private/Admin
exports.updateMember = asyncHandler(async (req, res, next) => {
  let member = await Member.findById(req.params.id);

  if (!member) {
    return next(
      new ErrorResponse(`Member not found with id of ${req.params.id}`, 404)
    );
  }

  member = await Member.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // If status was updated, send notification
  if (req.body.status && req.body.status !== member.status) {
    const statusMessage = `Your application status has been updated to: ${req.body.status}`;
    
    try {
      await sendEmail({
        email: member.email,
        subject: 'Redox Club Application Update',
        message: statusMessage,
      });
    } catch (err) {
      console.error('Status update email failed:', err);
    }
  }

  res.status(200).json({
    success: true,
    data: member,
  });
});

// @desc    Delete member
// @route   DELETE /api/v1/members/:id
// @access  Private/Admin
exports.deleteMember = asyncHandler(async (req, res, next) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    return next(
      new ErrorResponse(`Member not found with id of ${req.params.id}`, 404)
    );
  }

  await member.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Approve member
// @route   PUT /api/v1/members/:id/approve
// @access  Private/Admin
exports.approveMember = asyncHandler(async (req, res, next) => {
  let member = await Member.findById(req.params.id);

  if (!member) {
    return next(
      new ErrorResponse(`Member not found with id of ${req.params.id}`, 404)
    );
  }

  member.status = 'approved';
  await member.save();

  // Send approval email
  const emailMessage = `Congratulations! Your application to Redox Club has been approved. Welcome to the ${member.department} department!`;

  try {
    await sendEmail({
      email: member.email,
      subject: 'Redox Club Application Approved',
      message: emailMessage,
    });
  } catch (err) {
    console.error('Approval email failed:', err);
  }

  res.status(200).json({
    success: true,
    data: member,
  });
});

// @desc    Reject member
// @route   PUT /api/v1/members/:id/reject
// @access  Private/Admin
exports.rejectMember = asyncHandler(async (req, res, next) => {
  let member = await Member.findById(req.params.id);

  if (!member) {
    return next(
      new ErrorResponse(`Member not found with id of ${req.params.id}`, 404)
    );
  }

  member.status = 'rejected';
  await member.save();

  // Send rejection email
  const emailMessage = `Thank you for applying to Redox Club. After careful consideration, we regret to inform you that your application has not been successful this time. We encourage you to apply again in the future.`;

  try {
    await sendEmail({
      email: member.email,
      subject: 'Redox Club Application Update',
      message: emailMessage,
    });
  } catch (err) {
    console.error('Rejection email failed:', err);
  }

  res.status(200).json({
    success: true,
    data: member,
  });
});