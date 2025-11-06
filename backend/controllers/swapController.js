import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';
import SwapRequest from '../models/swapRequestModel.js';

// @desc    Get all swappable slots
// @route   GET /api/swappable-slots
// @access  Private
const getSwappableSlots = asyncHandler(async (req, res) => {
  const swappableSlots = await Event.find({
    status: 'SWAPPABLE',
    userId: { $ne: req.user._id },
  }).populate('userId', 'name email');
  
  res.json(swappableSlots);
});

// @desc    Create swap request
// @route   POST /api/swap-request
// @access  Private
const createSwapRequest = asyncHandler(async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;

  // Verify both slots exist and are swappable
  const mySlot = await Event.findById(mySlotId);
  const theirSlot = await Event.findById(theirSlotId);

  if (!mySlot || !theirSlot) {
    res.status(404);
    throw new Error('One or both slots not found');
  }

  if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
    res.status(400);
    throw new Error('One or both slots are not available for swapping');
  }

  // Create swap request
  const swapRequest = await SwapRequest.create({
    requesterId: req.user._id,
    receiverId: theirSlot.userId,
    mySlotId,
    theirSlotId,
  });

  // Mark both slots as pending
  await Event.updateMany(
    { _id: { $in: [mySlotId, theirSlotId] } },
    { status: 'SWAP_PENDING' }
  );

  res.status(201).json(swapRequest);
});

// @desc    Respond to swap request
// @route   POST /api/swap-response/:requestId
// @access  Private
const respondToSwapRequest = asyncHandler(async (req, res) => {
  const { response } = req.body; // 'ACCEPTED' or 'REJECTED'
  const swapRequest = await SwapRequest.findById(req.params.requestId);

  if (!swapRequest) {
    res.status(404);
    throw new Error('Swap request not found');
  }

  if (swapRequest.receiverId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to respond to this request');
  }

  if (response === 'ACCEPTED') {
    // Exchange userIds of the events
    const [mySlot, theirSlot] = await Promise.all([
      Event.findById(swapRequest.mySlotId),
      Event.findById(swapRequest.theirSlotId),
    ]);

    const tempUserId = mySlot.userId;
    mySlot.userId = theirSlot.userId;
    theirSlot.userId = tempUserId;

    mySlot.status = 'BUSY';
    theirSlot.status = 'BUSY';

    await Promise.all([mySlot.save(), theirSlot.save()]);
  } else {
    // Set both events back to SWAPPABLE
    await Event.updateMany(
      { _id: { $in: [swapRequest.mySlotId, swapRequest.theirSlotId] } },
      { status: 'SWAPPABLE' }
    );
  }

  swapRequest.status = response;
  await swapRequest.save();

  res.json(swapRequest);
});

export { getSwappableSlots, createSwapRequest, respondToSwapRequest };