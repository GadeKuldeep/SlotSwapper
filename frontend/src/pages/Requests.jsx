import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { swaps } from '../api/api';
import NotificationCard from '../components/NotificationCard';

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await swaps.getSwapRequests();
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await swaps.respondToSwapRequest(requestId, 'ACCEPTED');
      toast.success('Request accepted');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await swaps.respondToSwapRequest(requestId, 'REJECTED');
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const incomingRequests = requests.filter((r) => !r.isOutgoing);
  const outgoingRequests = requests.filter((r) => r.isOutgoing);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Incoming Requests</h2>
        {incomingRequests.length === 0 ? (
          <p className="text-gray-600">No incoming requests.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {incomingRequests.map((request) => (
              <NotificationCard
                key={request._id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </motion.div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Outgoing Requests</h2>
        {outgoingRequests.length === 0 ? (
          <p className="text-gray-600">No outgoing requests.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {outgoingRequests.map((request) => (
              <NotificationCard key={request._id} request={request} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Requests;