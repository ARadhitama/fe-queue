import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getCities, getProvinces, signup } from '../../services';

function SignupPage() {
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  const handleProvinceChange = async (event) => {
    const newProvince = event.target.value;

    setProvince(newProvince);
    setCity('');

    const cities = await getCities(newProvince);
    setCityData(cities);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleOwnerChange = (event) => {
    setOwner(
      event.target.value === 'serviceOwner' || event.target.value === '',
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      username: username,
      password: password,
      phone_number: phoneNumber,
      province: province,
      city: city,
      is_owner: owner,
    };

    try {
      await signup(payload);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [owner, setOwner] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const provinces = await getProvinces();
        setProvinceData(provinces);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  return (
    <div className="flex min-h-full w-full flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-gray-900 text-center text-2xl font-bold leading-9 tracking-tight">
          Signup
        </h2>
      </div>
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="text-gray-900 block text-sm font-medium leading-6"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="username"
                defaultValue={username}
                onChange={handleUsernameChange}
                required
                className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-gray-900 block text-sm font-medium leading-6"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                defaultValue={password}
                onChange={handlePasswordChange}
                required
                className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="phoneNumber"
                className="text-gray-900 block text-sm font-medium leading-6"
              >
                Phone Number
              </label>
            </div>
            <div className="mt-2">
              <input
                id="phoneNumber"
                type="number"
                inputMode="numeric"
                pattern="[0-9]"
                name="phoneNumber"
                defaultValue={phoneNumber}
                onChange={handlePhoneNumberChange}
                required
                className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="flex w-full space-x-4">
            <div className="w-full">
              <label
                htmlFor="province"
                className="text-gray-900 block text-sm font-medium leading-6"
              >
                Province
              </label>
              <select
                id="province"
                name="province"
                defaultValue={province}
                onChange={handleProvinceChange}
                required
                className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              >
                <option value="">Select Province</option>
                {provinceData.map((province) => (
                  <option key={province.name} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label
                htmlFor="city"
                className="text-gray-900 block text-sm font-medium leading-6"
              >
                City
              </label>
              <select
                id="city"
                name="city"
                defaultValue={city}
                onChange={handleCityChange}
                required
                className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              >
                <option value="">Select City</option>
                {cityData.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 w-full">
            <label
              htmlFor="owner"
              className="text-gray-900 block text-sm font-medium leading-6"
            >
              Account Type
            </label>
            <select
              id="owner"
              name="owner"
              defaultValue=""
              onChange={handleOwnerChange}
              required
              className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            >
              <option value="" disabled hidden>
                Select an option
              </option>
              <option value="serviceOwner">Service Owner</option>
              <option value="serviceUser">Service User</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-gray-500 mt-10 text-center text-sm">
          Already have an account?
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-500 font-semibold leading-6"
          >
            {' '}
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
