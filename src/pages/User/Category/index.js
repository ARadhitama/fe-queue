import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';


function CategoryPage() {
  const navigate = useNavigate ();
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login')
    }
    else {
        axios.get('http://124.158.142.45:2097/api/category/', {
        headers: {
            Authorization: token,
        },
        })
        .then(response => setCategoryData(response.data.Category))
        .catch(error => console.error(error));
    }
  }, []);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-4 lg:px-8">
      <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Categories</h1>
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-lg xl:max-w-3xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {categoryData.map((category) => (
            <Link key={category.name} to={`/service/?category=${category.name.toLowerCase()}`}>
              <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer xl:h-80">
                <div className="flex flex-col items-center justify-center h-80">
                  <div className="h-32 w-full flex items-center justify-center">
                    <img src={category.image} alt={category.name} className="h-full object-cover" />
                  </div>
                  <h2 className="text-lg font-medium text-gray-900 text-center mt-4">{category.name}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;