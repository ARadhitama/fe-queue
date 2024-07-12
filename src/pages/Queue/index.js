import React, { useEffect, useState } from 'react';

import { useAuth } from '../../components/layout';

import { checkQueue } from '../../services';

function QueuePage() {
  const handleClickRefreshButton = () => {
    fetchQueue();
  };

  const fetchQueue = async () => {
    try {
      const queue = await checkQueue();
      setQueueData(queue);
    } catch (error) {
      console.log(error);
    }
  };

  const [queueData, setQueueData] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetchQueue();
  }, [user]);

  return (
    <div className="flex min-h-full w-full flex-col px-6 py-4 lg:px-8">
      <div className="text-gray-900 mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
        Queue Num
      </div>
      <div className="text-gray-900 text-center text-2xl font-bold leading-9 tracking-tight">
        {queueData.user_queue_number}
      </div>
      <div className="mt-10 flex flex-col items-center justify-center text-sm">
        <div className="mb-2 text-center">
          <h2 className="font-bold">Name</h2>
          <p className="">{queueData.service_name}</p>
        </div>
        <div className="mb-2 text-center">
          <h2 className="font-bold">Detail</h2>
          <p className="">{queueData.service_details}</p>
        </div>
        <div className="mb-2 text-center">
          <h2 className="font-bold">Address</h2>
          <p className="">{queueData.service_address}</p>
        </div>
        <div className="mb-2 text-center">
          <h2 className="font-bold">Phone</h2>
          <p className="">{queueData.service_phone}</p>
        </div>
        <div className="mb-2 text-center">
          <h2 className="font-bold">Price</h2>
          <p className="">{queueData.service_price}</p>
        </div>
      </div>
      <div className="mt-10 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={handleClickRefreshButton}
          className="bg-indigo-600 text-white hover:bg-indigo-500 w-auto justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default QueuePage;
