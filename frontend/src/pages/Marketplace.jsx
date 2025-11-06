import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { events, swaps } from '../api/api';
import EventCard from '../components/EventCard';
import SwapModal from '../components/SwapModal';

const Marketplace = () => {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSwappableSlots();
    fetchUserEvents();
  }, []);

  const fetchSwappableSlots = async () => {
    try {
      const { data } = await swaps.getSwappableSlots();
      setSwappableSlots(data);
    } catch (error) {
      toast.error('Failed to fetch swappable slots');
    }
  };

  const fetchUserEvents = async () => {
    try {
      const { data } = await events.getMyEvents();
      setUserEvents(data);
    } catch (error) {
      toast.error('Failed to fetch your events');
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleRequestSwap = async (mySlotId, theirSlotId) => {
    try {
      await swaps.createSwapRequest({ mySlotId, theirSlotId });
      setIsModalOpen(false);
      toast.success('Swap request sent successfully');
      fetchSwappableSlots();
      fetchUserEvents();
    } catch (error) {
      toast.error('Failed to send swap request');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Swap Marketplace</h1>

      {swappableSlots.length === 0 ? (
        <p className="text-gray-600">No swappable slots available.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {swappableSlots.map((slot) => (
            <EventCard
              key={slot._id}
              event={slot}
              showActions={false}
              onClick={() => handleEventClick(slot)}
            />
          ))}
        </div>
      )}

      <SwapModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        selectedEvent={selectedEvent}
        userEvents={userEvents}
        onRequestSwap={handleRequestSwap}
      />
    </div>
  );
};

export default Marketplace;