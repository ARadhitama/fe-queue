import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '../../components/layout';
import Breadcrumb from '../../components/breadcrumb';

import { cancelQueue, checkQueue } from '../../services';

function QueuePage() {
  const handleClickCancelButton = async () => {
    try {
      await cancelQueue();
      await fetchQueue();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickRefreshButton = () => {
    fetchQueue();
  };

  const fetchQueue = async () => {
    try {
      const queue = await checkQueue();
      setIsFetched(true);
      setQueueData(queue);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [isFetched, setIsFetched] = useState(false);
  const [queueData, setQueueData] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetchQueue();
  }, [user]);

  if (!isFetched) {
    return null;
  }

  if (queueData === null) {
    return (
      <div className="flex min-h-full w-full flex-col pb-10 pt-7">
        <Breadcrumb label="Queue" />
        <div className="text-gray-900 mb-2 mt-5 text-center text-2xl font-bold leading-9 tracking-tight">
          Oops! There's nothing in the queue.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col pb-10 pt-7">
      <Breadcrumb label="Queue" />
      <div className="text-gray-900 mb-2 mt-5 text-center text-2xl font-bold leading-9 tracking-tight">
        Queue Num
      </div>
      <div className="text-gray-900 text-center text-4xl font-bold leading-9 tracking-tight">
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
      <div className="mt-10 flex flex-row items-center justify-center">
        <button
          type="button"
          onClick={handleClickCancelButton}
          className="bg-red-600 text-white hover:bg-red-500 mr-2 w-28 justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleClickRefreshButton}
          className="bg-indigo-600 text-white hover:bg-indigo-500 w-28 justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default QueuePage;
