import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '../../components/layout';
import Breadcrumb from '../../components/breadcrumb';
import ModalService from './Modal';

import {
  getCities,
  getMyServices,
  getProvinces,
  getServicesByCategory,
} from '../../services';

function ServicePage() {
  const handleChangeProvince = async (event) => {
    const province = event.target.value;

    if (!province) {
      await fetchServices(null, null);
      setCityData([]);
      return;
    }

    await fetchServices(province, null);

    const cities = await getCities(province);
    setCityData(cities);
  };

  const handleChangeCity = async (event) => {
    const city = event.target.value;

    let province = '';
    const formData = new FormData(formRef.current);
    formData.forEach((value, key) => {
      if (key === 'province') {
        province = value;
      }
    });

    await fetchServices(province, city);
  };

  const fetchServices = async (province, city) => {
    try {
      const services = user.is_owner
        ? await getMyServices()
        : await getServicesByCategory(category, province, city);

      setServiceData(services);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchProvince = async () => {
    try {
      const provinces = await getProvinces();
      setProvinceData(provinces);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCities = async (province) => {
    try {
      const cities = await getCities(province);
      setCityData(cities);
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

  const formRef = useRef();

  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [serviceDetailId, setServiceDetailId] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();

  const isOwner = user.is_owner;

  useEffect(() => {
    if (!user) return;

    if (!user.is_owner) {
      fetchProvince();
      fetchCities(user.province);

      for (const [key, value] of Object.entries(user)) {
        if (key === 'province' || key === 'city') {
          setTimeout(() => {
            const inputElement = formRef.current.querySelector(
              `[name="${key}"]`,
            );
            if (inputElement) {
              inputElement.value = value;
            }
          }, 100);
        }
      }
    }

    fetchServices(user.province, user.city);
    // eslint-disable-next-line
  }, [user]);

  if (!category && !user.is_owner) {
    navigate('/category');
  }

  return (
    <div className="flex min-h-full w-full flex-col pb-10 pt-7">
      {!isOwner && <Breadcrumb label="Services" />}
      <div className="relative mt-5 flex items-center justify-center">
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
      {!isOwner && (
        <form ref={formRef} className="w-full">
          <div className="mt-5 flex w-full items-center justify-center">
            <div className="text-gray-700 flex-2 mb-2 mr-5 flex flex-col items-center justify-between text-sm">
              <label htmlFor="province" className="font-semibold">
                Province:
              </label>
              <select
                id="province"
                name="province"
                required
                className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 mt-1 block w-48 rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                onChange={handleChangeProvince}
              >
                <option value="">All Provinces</option>
                {provinceData.map((province) => (
                  <option key={province.name} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-gray-700 flex-2 mb-2 flex flex-col items-center justify-between text-sm">
              <label htmlFor="city" className="font-semibold">
                City:
              </label>
              <select
                id="city"
                name="city"
                required
                className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 mt-1 block w-48 rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                onChange={handleChangeCity}
              >
                <option value="">All Cities</option>
                {cityData.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      )}
      <div className="mt-7 w-full">
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
