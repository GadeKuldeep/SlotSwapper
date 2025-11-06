import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import EventCard from './EventCard';

const SwapModal = ({
  isOpen,
  onClose,
  selectedEvent,
  userEvents,
  onRequestSwap,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 mb-4"
              >
                Select Your Slot to Swap
              </Dialog.Title>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Their Slot:</h4>
                {selectedEvent && (
                  <EventCard event={selectedEvent} showActions={false} />
                )}
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Your Available Slots:</h4>
                <div className="max-h-60 overflow-y-auto">
                  {userEvents
                    .filter((event) => event.status === 'SWAPPABLE')
                    .map((event) => (
                      <EventCard
                        key={event._id}
                        event={event}
                        showActions={false}
                        onClick={() =>
                          onRequestSwap(event._id, selectedEvent._id)
                        }
                      />
                    ))}
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SwapModal;