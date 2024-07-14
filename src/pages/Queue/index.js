import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '../../components/layout';
import Breadcrumb from '../../components/breadcrumb';

import {
  cancelQueue,
  checkQueue,
  getMyServiceDetail,
  getMyServices,
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
      const services = await getMyServices();
      const serviceDetailPromises = services.map(async ({ service_id }) => {
        const serviceDetail = await getMyServiceDetail(service_id);
        if (Object.keys(serviceDetail).length !== 0) {
          return serviceDetail;
        }
        return null;
      });

      const serviceDetails = (await Promise.all(serviceDetailPromises)).filter(
        (detail) => detail !== null,
      );

      setIsFetched(true);
      setServiceData(serviceDetails);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navigate = useNavigate();
  const [isFetched, setIsFetched] = useState(false);
  const [queueData, setQueueData] = useState(false);
  const [serviceData, setServiceData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    user.is_owner ? fetchService() : fetchQueue();
  }, [user]);

  if (!isFetched) {
    return null;
  }

  if (
    (!user.is_owner && queueData === null) ||
    (user.is_owner && serviceData.length === 0)
  ) {
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
      {user.is_owner ? (
        <div className="mt-10 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="border-gray-200 overflow-hidden border-b sm:rounded-lg">
                <table className="divide-gray-200 w-full divide-y">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="text-gray-900 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Queue Num
                      </th>
                      <th
                        scope="col"
                        className="text-gray-900 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Customer Name
                      </th>
                      <th
                        scope="col"
                        className="text-gray-900 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="text-gray-900 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-gray-200 divide-y">
                    {serviceData.map((service, i) => (
                      <tr key={i}>
                        <td className="text-gray-900 w-[20%] whitespace-nowrap px-6 py-4 text-sm">
                          {service.queue_num}
                        </td>
                        <td className="text-gray-900 w-[30%] whitespace-nowrap px-6 py-4 text-sm">
                          {service.customer_name}
                        </td>
                        <td className="text-gray-900 w-[20%] whitespace-nowrap px-6 py-4 text-sm">
                          {service.phone_number}
                        </td>
                        <td className="w-[30%] whitespace-nowrap">
                          <div className="flex flex-row items-center justify-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleClickAction(
                                  service.service_id,
                                  'rejected',
                                )
                              }
                              className="bg-red-600 text-white hover:bg-red-500 mr-2 w-24 justify-center rounded-md py-1 text-sm font-semibold shadow-sm"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleClickAction(
                                  service.service_id,
                                  'accepted',
                                )
                              }
                              className="bg-indigo-600 text-white hover:bg-indigo-500 w-24 justify-center rounded-md py-1 text-sm font-semibold shadow-sm"
                            >
                              Confirm
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white mt-6 rounded-lg pb-4 pt-2 shadow">
            <div className="text-gray-900 text-center text-2xl font-bold">
              Queue Num
            </div>
            <div className="text-gray-900 text-center text-6xl font-bold">
              {queueData.user_queue_number}
            </div>
          </div>
          <div className="bg-white mt-6 flex items-center justify-center rounded-lg py-4 shadow">
            <div className="-ml-10 mr-10 flex h-60 w-60 items-center justify-center">
              <img
                className="h-full w-full object-cover"
                src={queueData.service_image}
                alt=""
              />
            </div>
            <div className="flex flex-col text-sm">
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
            </div>
          </div>
          <div className="mt-6 flex flex-row items-center justify-center">
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
        </>
      )}
    </div>
  );
}

export default QueuePage;
