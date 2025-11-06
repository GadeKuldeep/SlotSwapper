import { format } from 'date-fns';
import { motion } from 'framer-motion';

const EventCard = ({
  event,
  onToggleStatus,
  onDelete,
  showActions = true,
  onClick,
}) => {
  const statusColors = {
    BUSY: 'bg-red-100 border-red-500',
    SWAPPABLE: 'bg-green-100 border-green-500',
    SWAP_PENDING: 'bg-yellow-100 border-yellow-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border-2 mb-4 ${
        statusColors[event.status]
      } cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
      <div className="text-sm text-gray-600">
        <p>
          Start: {format(new Date(event.startTime), 'MMM d, yyyy h:mm a')}
        </p>
        <p>End: {format(new Date(event.endTime), 'MMM d, yyyy h:mm a')}</p>
        <p className="mt-2">Status: {event.status}</p>
      </div>

      {showActions && (
        <div className="mt-4 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(event);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {event.status === 'BUSY' ? 'Make Swappable' : 'Make Busy'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event._id);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default EventCard;