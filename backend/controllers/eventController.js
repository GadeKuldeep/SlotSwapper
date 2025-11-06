import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';

// @desc    Get user's events
// @route   GET /api/events/my
// @access  Private
const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ userId: req.user._id });
  res.json(events);
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const { title, startTime, endTime, status } = req.body;

  const event = await Event.create({
    title,
    startTime,
    endTime,
    status,
    userId: req.user._id,
  });

  res.status(201).json(event);
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this event');
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedEvent);
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  // Log for debugging in case of unexpected failures
  console.log('Attempting to delete event', req.params.id, 'by user', req.user?._id);

  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this event');
  }

  // Use findByIdAndDelete to avoid potential issues with document.remove()
  const deleted = await Event.findByIdAndDelete(req.params.id);

  if (!deleted) {
    // This is unlikely since we checked above, but guard anyway
    res.status(500);
    throw new Error('Failed to delete event');
  }

  res.json({ message: 'Event removed' });
});

// @desc    Get event by id
// @route   GET /api/events/:id
// @access  Private
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.json(event);
});

export { getMyEvents, createEvent, updateEvent, deleteEvent, getEventById };