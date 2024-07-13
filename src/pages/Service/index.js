import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '../../components/layout';
import ModalService from './Modal';

import { getMyServices, getServicesByCategory } from '../../services';

function ServicePage() {
  const fetchServices = async () => {
    try {
      const services = user.is_owner
        ? await getMyServices()
        : await getServicesByCategory(category);

      setServiceData(services);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setServiceDetailId(false);
  };

  const handleClickService = async (id, isOpen) => {
    setServiceDetailId(id);
    setIsServiceOpen(isOpen);
    setIsModalOpen(true);
  };

  const handleClickCreateBtn = () => {
    setIsModalOpen(true);
  };

  const navigate = useNavigate();
  const { category } = useParams();

  const [serviceData, setServiceData] = useState([]);
  const [serviceDetailId, setServiceDetailId] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();

  const isOwner = user.is_owner;

  useEffect(() => {
    if (!user) return;

    fetchServices();

    // eslint-disable-next-line
  }, [user]);

  if (!category && !user.is_owner) {
    navigate('/category');
  }

  return (
    <div className="flex min-h-full w-full flex-col py-10">
      <div className="relative flex items-center justify-center">
        <h1 className="text-gray-900 text-center text-2xl font-bold leading-9 tracking-tight">
          Services
        </h1>
        {isOwner && (
          <button
            type="button"
            onClick={handleClickCreateBtn}
            className="bg-indigo-600 text-white hover:bg-indigo-500 absolute right-0 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto"
          >
            +
          </button>
        )}
      </div>
      <div className="mt-5 w-full">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {serviceData.map((service, i) => (
            <div
              key={service.service_id}
              className="bg-white h-60 cursor-pointer overflow-hidden rounded-lg shadow"
              onClick={() =>
                handleClickService(service.service_id, service.is_open)
              }
            >
              <div className="flex h-full flex-col items-center justify-center">
                <div className="flex h-32 w-full items-center justify-center">
                  <img
                    src={service.service_image}
                    alt={service.service_name}
                    className="h-full object-cover"
                  />
                </div>
                <h2 className="text-gray-900 mb-2 mt-4 text-center text-lg font-medium">
                  {service.service_name}
                </h2>
                {service.is_open ? (
                  <span className="bg-indigo-50 text-indigo-700 ring-indigo-700/10 inline-flex items-center rounded-md px-2 text-xs font-medium ring-1 ring-inset">
                    Open
                  </span>
                ) : (
                  <span className="bg-pink-50 text-pink-700 ring-pink-700/10 inline-flex items-center rounded-md px-2 text-xs font-medium ring-1 ring-inset">
                    Closed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ModalService
        serviceId={serviceDetailId}
        isServiceOpen={isServiceOpen}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        fetchServices={fetchServices}
      />
    </div>
  );
}

export default ServicePage;
