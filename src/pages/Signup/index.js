import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';


function SignupPage() {
  const navigate = useNavigate ();
  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [owner, setOwner] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    setPhoneNumber(value);
  };

  const handleProvinceChange = event => {
    setProvince(event.target.value);
    setCity('');
  };

  const handleCityChange = event => {
    setCity(event.target.value);
  };

  const handleOwnerChange = (event) => {
    setOwner(event.target.value === 'serviceOwner' || event.target.value === '');
  };

  useEffect(() => {
    axios.get('http://124.158.142.45:2097/api/province/')
      .then(response => setProvinceData(response.data.Province))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (province) {
      axios.get(`http://124.158.142.45:2097/api/city/?province=${province}`)
        .then(response => setCityData(response.data.City))
        .catch(error => console.error(error));
    } else {
      setCityData([]);
    }
  }, [province]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post('http://124.158.142.45:2097/oauth/signup/', {
          "username": username,
          "password": password,
          "phone_number": phoneNumber,
          "province": province,
          "city": city,
          "is_owner": owner
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.request.status === 200) {
          setError('');
          navigate('/login');
        } else {
            console.log(response.request)
        }
      } catch (error) {
        console.log(error)
      }

    setUsername('');
    setPassword('');
    setPhoneNumber('');
    setProvince('');
    setCity('');
    setOwner('');
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-32 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Queue</h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
              <div className="mt-2">
                <input id="username" name="username" type="username" defaultValue={username} onChange={handleUsernameChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"/>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
              </div>
              <div className="mt-2">
                <input id="password" name="password" type="password" defaultValue={password} onChange={handlePasswordChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"/>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
              </div>
              <div className="mt-2">
                <input id="phoneNumber" type="number" inputMode="numeric" pattern="[0-9]" name="phoneNumber" defaultValue={phoneNumber} onChange={handlePhoneNumberChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"/>
              </div>
            </div>
            <div className="flex space-x-4 w-full">
             <div className="w-full">
              <label htmlFor="province" className="block text-sm font-medium leading-6 text-gray-900">Province</label>
              <select
              id="province"
              name="province"
              defaultValue={province}
              onChange={handleProvinceChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              >
              <option value="">Select Province</option>
              {provinceData.map(province => (
               <option key={province.name} value={province.name}>{province.name}</option>
              ))}
              </select>
             </div>
             <div className="w-full">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">City</label>
              <select
              id="city"
              name="city"
              defaultValue={city}
              onChange={handleCityChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              >
              <option value="">Select City</option>
              {cityData.map(city => (
               <option key={city.name} value={city.name}>{city.name}</option>
              ))}
             </select>
             </div>
            </div>
            <div className="w-full mt-4">
             <label htmlFor="owner" className="block text-sm font-medium leading-6 text-gray-900">Account Type</label>
             <select
             id="owner"
             name="owner"
             defaultValue=''
             onChange={handleOwnerChange}
             required
             className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
             >
              <option value="" disabled hidden>Select an option</option>
              <option value="serviceOwner">Service Owner</option>
              <option value="serviceUser">Service User</option>
             </select>
            </div>
            <div>
             <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign Up</button>
            </div>
          </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account? 
          <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage;