import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mySlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    theirSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for efficient querying
swapRequestSchema.index({ requesterId: 1, status: 1 });
swapRequestSchema.index({ receiverId: 1, status: 1 });

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest;