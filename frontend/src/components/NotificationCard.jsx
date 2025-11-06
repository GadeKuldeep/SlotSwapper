import { motion } from 'framer-motion';
import { format } from 'date-fns';

const NotificationCard = ({ request, onAccept, onReject }) => {
  const isIncoming = request.receiverId === request.currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 rounded-lg border-2 border-indigo-200 bg-white mb-4 shadow-sm"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {isIncoming ? 'Incoming Request' : 'Outgoing Request'}
          </h3>
          <p className="text-sm text-gray-600">
            Status: {request.status}
          </p>
          <p className="text-sm text-gray-600">
            Requested: {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
          </p>
        </div>

        {isIncoming && request.status === 'PENDING' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onAccept(request._id)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Accept
            </button>
            <button
              onClick={() => onReject(request._id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Your Slot</h4>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-medium">{request.mySlot.title}</p>
            <p className="text-sm text-gray-600">
              Start: {format(new Date(request.mySlot.startTime), 'MMM d, h:mm a')}
            </p>
            <p className="text-sm text-gray-600">
              End: {format(new Date(request.mySlot.endTime), 'MMM d, h:mm a')}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Their Slot</h4>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-medium">{request.theirSlot.title}</p>
            <p className="text-sm text-gray-600">
              Start: {format(new Date(request.theirSlot.startTime), 'MMM d, h:mm a')}
            </p>
            <p className="text-sm text-gray-600">
              End: {format(new Date(request.theirSlot.endTime), 'MMM d, h:mm a')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;