import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '../../components/layout';
import Breadcrumb from '../../components/breadcrumb';

import {
  cancelQueue,
  checkQueue,
  getMyServiceDetail,
  processQueue,
} from '../../services';

function QueuePage() {
  const handleClickAction = async (id, type) => {
    try {
      await processQueue(id, type);
      await fetchService();
      toast.success(
        type === 'accepted'
          ? 'Confirmed successfully'
          : 'Rejected successfully',
      );
      serviceData.in_queue === 1 && navigate('/service');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickCancelButton = async () => {
    try {
      await cancelQueue();
      await fetchQueue();
      toast.success('Queue cancellation successful');
      navigate('/category');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickRefreshButton = async () => {
    await fetchQueue();
    toast.success('Queue refreshed successfully');
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

  const fetchService = async () => {
    try {
      const service = await getMyServiceDetail(id);
      setIsFetched(true);
      setServiceData(service);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const [isFetched, setIsFetched] = useState(false);
  const [queueData, setQueueData] = useState(false);
  const [serviceData, setServiceData] = useState(false);

  const { user } = useAuth();
  const isOwner = user.is_owner;

  useEffect(() => {
    if (!user) return;

    if (isOwner && !id) {
      navigate('/service');
      return;
    }

    user.is_owner ? fetchService() : fetchQueue();

    // eslint-disable-next-line
  }, [user]);

  if (!isFetched) {
    return null;
  }

  if ((isOwner && serviceData === null) || (!isOwner && queueData === null)) {
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
      <div className="bg-white mt-6 rounded-lg pb-4 pt-2 shadow">
        <div className="text-gray-900 text-center text-2xl font-bold">
          {isOwner ? "In Queue" : queueData.user_queue_number === 0 ? "": "User ahead in line"}
        </div>
        <div className="text-gray-900 text-center text-6xl font-bold">
          {isOwner ? serviceData.in_queue : queueData.user_queue_number === 0 ? "It's Your Turn": queueData.user_queue_number}
        </div>
      </div>
      <div className="bg-white mt-6 flex items-center justify-center rounded-lg py-4 shadow">
        <div
          className={`${isOwner ? 'hidden' : ''} -ml-10 mr-10 flex h-60 w-60 items-center justify-center`}
        >
          <img
            className="h-full w-full object-cover"
            src={queueData.service_image}
            alt=""
          />
        </div>
        <div
          className={`${isOwner ? 'text-center' : ''} flex flex-col text-sm`}
        >
          {isOwner ? (
            <>
              <div className="mb-2">
                <h2 className="font-bold">Service Name</h2>
                <p className="">{serviceData.service_name}</p>
              </div>
              <div className="mb-2">
                <h2 className="font-bold">Customer Name</h2>
                <p className="">{serviceData.customer_name}</p>
              </div>
              <div className="mb-2">
                <h2 className="font-bold">Phone Number</h2>
                <p className="">{serviceData.phone_number}</p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-2">
                <h2 className="font-bold">Name</h2>
                <p className="">{queueData.service_name}</p>
              </div>
              <div className="mb-2">
                <h2 className="font-bold">Detail</h2>
                <p className="">{queueData.service_details}</p>
              </div>
              <div className="mb-2">
                <h2 className="font-bold">Address</h2>
                <p className="">{queueData.service_address}</p>
              </div>
              <div className="mb-2">
                <h2 className="font-bold">Phone</h2>
                <p className="">{queueData.service_phone}</p>
              </div>
              <div className="mb-2">
                <h2 className="font-bold">Price</h2>
                <p className="">{queueData.service_price}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-row items-center justify-center">
        <button
          className="bg-red-600 text-white hover:bg-red-500 mr-2 w-28 justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm"
          type="button"
          onClick={() =>
            isOwner
              ? handleClickAction(id, 'rejected')
              : handleClickCancelButton()
          }
        >
          {isOwner ? 'Reject' : 'Cancel'}
        </button>
        <button
          className="bg-indigo-600 text-white hover:bg-indigo-500 w-28 justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm"
          type="button"
          onClick={() =>
            isOwner
              ? handleClickAction(id, 'accepted')
              : handleClickRefreshButton()
          }
        >
          {isOwner ? 'Confirm' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}

export default QueuePage;
