import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { toast } from 'sonner';

import { useAuth } from '../../components/layout';

import {
  closeService,
  createQueue,
  createService,
  deleteService,
  getCategories,
  getCities,
  getProvinces,
  getServiceDetail,
  openService,
  updateService,
} from '../../services';

function ModalService(props) {
  const queue = async () => {
    try {
      await createQueue(serviceId);
      navigate('/queue');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const create = async (payload) => {
    try {
      await createService(payload);
      await fetchServices();
      handleCloseModal();
      toast.success('Create successfull');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const update = async (payload) => {
    try {
      await updateService(payload);
      await fetchServices();
      handleCloseModal();
      toast.success('Update successfull');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (modalType === 'queue') {
      queue();
      return;
    }

    const formData = new FormData(formRef.current);

    const payload = {};
    formData.forEach((value, key) => {
      if (key === 'open_time' || key === 'close_time') {
        payload[key] = value + ':00';
      } else {
        payload[key] = value;
      }
    });

    if (modalType === 'create') {
      payload.category_id = Number(payload.category_id);
      payload.price = Number(payload.price);
      create(payload);
    }

    if (modalType === 'update') {
      payload.category_id = Number(payload.category_id);
      payload.price = Number(payload.price);
      payload.service_id = Number(serviceId);
      update(payload);
    }
  };

  const handleDeleteService = async () => {
    try {
      await deleteService(serviceId);
      await fetchServices();
      handleCloseModal();
      toast.success('Delete successfull');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChangeStatusService = async () => {
    try {
      isServiceOpen
        ? await closeService(serviceId)
        : await openService(serviceId);
      await fetchServices();
      handleCloseModal();
      toast.success('Update successfull');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleExternalSubmit = async () => {
    if (modalType === 'view') {
      setModalType('update');
      await new Promise((resolve) => setTimeout(resolve, 50));

      for (const [key, value] of Object.entries(serviceData)) {
        if (key === 'category_id') {
          const inputElement = formRef.current.querySelector(`[name="${key}"]`);
          inputElement.value = value;
        }

        if (key === 'province' || key === 'city') {
          const inputElement = formRef.current.querySelector(`[name="${key}"]`);
          inputElement.value = value;
        }
      }
      return;
    }

    formRef.current.requestSubmit();
  };

  const handleChangeProvince = async (event) => {
    const newProvince = event.target.value;

    const cities = await getCities(newProvince);
    setCityData(cities);
  };

  const setTitle = () => {
    if (modalType === 'view') return 'View Service';
    if (modalType === 'create') return 'Create Service';
    if (modalType === 'update') return 'Edit Service';
    if (modalType === 'queue') return '';
    return '';
  };

  const setBtnText = () => {
    if (modalType === 'view') return 'Edit';
    if (modalType === 'create') return 'Create';
    if (modalType === 'update') return 'Update';
    if (modalType === 'queue') return 'Queue';
    return '';
  };

  const {
    serviceId,
    isServiceOpen,
    isModalOpen,
    handleCloseModal,
    fetchServices,
  } = props;

  const navigate = useNavigate();

  const formRef = useRef();
  const [modalType, setModalType] = useState(false);
  const [serviceData, setServiceData] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const { user } = useAuth();
  const isOwner = user.is_owner;

  const title = setTitle();
  const btnText = setBtnText();

  useEffect(() => {
    if (!isModalOpen) return;

    const fetchServiceDetail = async () => {
      try {
        const service = await getServiceDetail(serviceId);
        setServiceData(service);

        for (const [key, value] of Object.entries(service)) {
          let newValue = value;

          if (key === 'category_id') {
            await new Promise((resolve) => setTimeout(resolve, 50));
            newValue = service['category_name'];
          }

          if (key === 'province') {
            const cities = await getCities(newValue);
            setCityData(cities);
            await new Promise((resolve) => setTimeout(resolve, 50));
          }

          const inputElement = formRef.current.querySelector(`[name="${key}"]`);
          if (inputElement) {
            inputElement.value = newValue;
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategoryData(categories);
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchProvinces = async () => {
      try {
        const provinces = await getProvinces();
        setProvinceData(provinces);
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (isOwner && serviceId) {
      setModalType('view');
      fetchCategories();
      fetchProvinces();
      fetchServiceDetail();
    } else if (isOwner) {
      setModalType('create');
      fetchCategories();
      fetchProvinces();
    } else {
      setModalType('queue');
      fetchServiceDetail();
    }
  }, [isModalOpen, serviceId, isOwner, formRef]);

  return (
    <Dialog
      open={isModalOpen}
      onClose={() => {
        handleCloseModal();
      }}
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
            <div className="bg-white px-6 pb-2 pt-5">
              <div className="">
                <div className="w-full text-center">
                  <DialogTitle
                    as="h3"
                    className="text-gray-900 mb-4 text-center text-lg font-semibold"
                  >
                    {title}
                  </DialogTitle>
                  <form
                    ref={formRef}
                    className="w-full"
                    onSubmit={handleSubmit}
                  >
                    <div className="text-gray-700 mb-2 flex w-full items-center justify-between text-sm">
                      <label htmlFor="category_id">Category:</label>
                      {modalType === 'view' || modalType === 'queue' ? (
                        <input
                          id="category_id"
                          name="category_id"
                          type="text"
                          required
                          className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                          disabled={
                            modalType === 'view' || modalType === 'queue'
                          }
                        />
                      ) : (
                        <select
                          id="category_id"
                          name="category_id"
                          required
                          className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                          disabled={
                            modalType === 'view' || modalType === 'queue'
                          }
                        >
                          <option value="">Select Category</option>
                          {categoryData.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="text-gray-700 mb-2 flex w-full items-center justify-between text-sm">
                      <label htmlFor="name">Name:</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                        disabled={modalType === 'view' || modalType === 'queue'}
                      />
                    </div>
                    <div className="text-gray-700 mb-2 flex w-full items-center justify-between text-sm">
                      <label htmlFor="phone">Phone:</label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        required
                        className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                        disabled={modalType === 'view' || modalType === 'queue'}
                      />
                    </div>
                    <div className="text-gray-700 mb-2 flex w-full items-center justify-between text-sm">
                      <label htmlFor="address">Address:</label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        required
                        className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                        disabled={modalType === 'view' || modalType === 'queue'}
                      />
                    </div>
                    <div className="text-gray-700 mb-2 flex w-full items-center justify-between text-sm">
                      <label htmlFor="details">Details:</label>
                      <input
                        id="details"
                        name="details"
                        type="text"
                        required
                        className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                        disabled={modalType === 'view' || modalType === 'queue'}
                      />
                    </div>
                    <div className="text-gray-700 mb-2 flex w-full items-center justify-between text-sm">
                      <label htmlFor="price">Price:</label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        required
                        className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                        disabled={modalType === 'view' || modalType === 'queue'}
                      />
                    </div>
                    <div className="text-gray-700 mb-2 flex w-full items-center justify-between text-sm">
                      <label htmlFor="open_time">Open time:</label>
                      <input
                        id="open_time"
                        name="open_time"
                        type="time"
                        required
                        className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                        disabled={modalType === 'view' || modalType === 'queue'}
                      />
                    </div>
                    <div className="text-gray-700 mb-2 flex w-full items-center justify-between text-sm">
                      <label htmlFor="close_time">Close time:</label>
                      <input
                        id="close_time"
                        name="close_time"
                        type="time"
                        required
                        className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                        disabled={modalType === 'view' || modalType === 'queue'}
                      />
                    </div>
                    <div className="text-gray-700 mb-2 flex w-full items-center justify-between text-sm">
                      <label htmlFor="image">Image:</label>
                      <input
                        id="image"
                        name="image"
                        type="text"
                        required
                        className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                        disabled={modalType === 'view' || modalType === 'queue'}
                      />
                    </div>
                    <div className="text-gray-700 mb-2 flex w-full items-center justify-between text-sm">
                      <label htmlFor="province">Province:</label>
                      {modalType === 'view' || modalType === 'queue' ? (
                        <input
                          id="province"
                          name="province"
                          type="text"
                          required
                          className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                          disabled={
                            modalType === 'view' || modalType === 'queue'
                          }
                        />
                      ) : (
                        <select
                          id="province"
                          name="province"
                          onChange={handleChangeProvince}
                          required
                          className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                          disabled={
                            modalType === 'view' || modalType === 'queue'
                          }
                        >
                          <option value="">Select Province</option>
                          {provinceData.map((province) => (
                            <option key={province.name} value={province.name}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="text-gray-700 mb-2 flex w-full items-center justify-between text-sm">
                      <label htmlFor="city">City:</label>
                      {modalType === 'view' || modalType === 'queue' ? (
                        <input
                          id="city"
                          name="city"
                          type="text"
                          required
                          className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                          disabled={
                            modalType === 'view' || modalType === 'queue'
                          }
                        />
                      ) : (
                        <select
                          id="city"
                          name="city"
                          required
                          className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-500 block w-[80%] rounded-md border-0 px-2 py-1 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset"
                          disabled={
                            modalType === 'view' || modalType === 'queue'
                          }
                        >
                          <option value="">Select City</option>
                          {cityData.map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 relative flex items-center justify-end px-6 py-3">
              <button
                type="button"
                data-autofocus
                onClick={() => {
                  handleCloseModal();
                }}
                className="bg-white text-gray-900 ring-gray-300 hover:bg-gray-50 absolute left-5 inline-flex w-auto justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
              >
                Cancel
              </button>
              {(modalType === 'view' || modalType === 'update') && (
                <button
                  type="button"
                  onClick={handleDeleteService}
                  className="bg-red-600 text-white hover:bg-red-500 ring-gray-300 ml-2 w-auto justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
                >
                  Delete
                </button>
              )}
              {(modalType === 'view' || modalType === 'update') && (
                <>
                  <button
                    type="button"
                    onClick={handleChangeStatusService}
                    className="bg-green-600 text-white hover:bg-green-500 ring-gray-300 ml-2 w-auto justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
                  >
                    {isServiceOpen ? 'Close' : 'Open'}
                  </button>
                  <button
                    type="button"
                    className={`${serviceData.current_queue_number < 1 ? 'disabled' : ''} bg-green-600 text-white hover:bg-green-500 ring-gray-300 ml-2 w-auto justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset`}
                    onClick={() => navigate(`/queue/${serviceId}`)}
                  >
                    Manage Queue
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleExternalSubmit}
                className={`${modalType === 'queue' && !isServiceOpen ? 'disabled' : ''} bg-indigo-600 text-white hover:bg-indigo-500 ring-gray-300 ml-2 w-auto justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset`}
              >
                {btnText}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default ModalService;
