import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { toast } from 'sonner';

import { useAuth } from '../../components/layout';

import {
  createQueue,
  getServiceDetail,
  getServicesByCategory,
} from '../../services';

function ServicePage() {
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setServiceDetailId(false);
  };

  const handleClickService = async (id) => {
    try {
      const service = await getServiceDetail(id);
      setServiceDetail(service);
      setServiceDetailId(id);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickQueueButton = async () => {
    try {
      await createQueue(serviceDetailId);
      navigate('/queue');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { category } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState([]);
  const [serviceDetail, setServiceDetail] = useState({});
  const [serviceDetailId, setServiceDetailId] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchServices = async () => {
      try {
        const services = await getServicesByCategory(category);
        setServiceData(services);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchServices();
  }, [user, category]);

  return (
    <div className="flex min-h-full w-full flex-col px-6 py-4 lg:px-8">
      <h1 className="text-gray-900 mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
        Services
      </h1>
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-lg xl:max-w-3xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {serviceData.map((service) => (
            <div
              key={service.id}
              className="bg-white cursor-pointer overflow-hidden rounded-lg shadow xl:h-80"
              onClick={() => handleClickService(service.id)}
            >
              <div className="flex h-80 flex-col items-center justify-center">
                <div className="flex h-32 w-full items-center justify-center">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-full object-cover"
                  />
                </div>
                <h2 className="text-gray-900 mt-4 text-center text-lg font-medium">
                  {service.name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="bg-black/40 fixed inset-0 duration-300 ease-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="bg-white relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-gray-900 text-base font-semibold leading-6"
                    >
                      {serviceDetail.name}
                    </DialogTitle>
                    <div className="text-gray-500 my-2 break-words text-sm">
                      <p>Category: {serviceDetail.category}</p>
                      <p>Name: {serviceDetail.name}</p>
                      <p>Detail: {serviceDetail.details}</p>
                      <p>Address: {serviceDetail.address}</p>
                      <p>Province: {serviceDetail.province_name}</p>
                      <p>City: {serviceDetail.city}</p>
                      <p>Price: {serviceDetail.price}</p>
                      <p>Open time: {serviceDetail.open_time}</p>
                      <p>Close time: {serviceDetail.close_time}</p>
                      <p>
                        Current queue number:{' '}
                        {serviceDetail.current_queue_number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => handleClickQueueButton(serviceDetail.name)}
                  className="bg-indigo-600 text-white hover:bg-indigo-500 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto"
                >
                  Queue
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white text-gray-900 ring-gray-300 hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default ServicePage;
