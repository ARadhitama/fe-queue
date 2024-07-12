import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export const checkLogin = async () => {
  try {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;

    const { data } = await axios.get('/oauth/check_login/');
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (username, password) => {
  try {
    const { data } = await axios.post('/oauth/login/', { username, password });

    localStorage.setItem('token', data.token);
  } catch (error) {
    throw error.response.data;
  }
};

export const signup = async (payload) => {
  try {
    await axios.post('/oauth/signup/', payload);
  } catch (error) {
    throw error.response.data;
  }
};

export const getProvinces = async () => {
  try {
    const { data } = await axios.get('/api/province/');
    return data.Province;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCities = async (province) => {
  try {
    const { data } = await axios.get(`/api/city/?province=${province}`);
    return data.City;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCategories = async () => {
  try {
    const { data } = await axios.get('/api/category/');
    return data.Category;
  } catch (error) {
    throw error.response.data;
  }
};

export const getServicesByCategory = async (category) => {
  try {
    const { data } = await axios.post(
      `/api/services/?category=${category}`,
      {},
    );
    return data.services;
  } catch (error) {
    throw error.response.data;
  }
};

export const getServiceDetail = async (service_id) => {
  try {
    const { data } = await axios.post(`/api/service_detail/`, { service_id });
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createQueue = async (service_id) => {
  try {
    const { data } = await axios.post(`/api/queue/`, { service_id });
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const checkQueue = async () => {
  try {
    const { data } = await axios.get(`/api/check_queue/`);
    return data.data;
  } catch (error) {
    throw error.response.data;
  }
};
