import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '../../components/layout';

import { getCategories } from '../../services';

function CategoryPage() {
  const [categoryData, setCategoryData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategoryData(categories);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchCategories();
  }, [user]);

  return (
    <div className="flex min-h-full w-full flex-col px-6 py-4 lg:px-8">
      <h1 className="text-gray-900 mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
        Categories
      </h1>
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-lg xl:max-w-3xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {categoryData.map((category) => (
            <Link
              key={category.name}
              to={`/service/${category.name.toLowerCase()}`}
            >
              <div className="bg-white cursor-pointer overflow-hidden rounded-lg shadow xl:h-80">
                <div className="flex h-80 flex-col items-center justify-center">
                  <div className="flex h-32 w-full items-center justify-center">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full object-cover"
                    />
                  </div>
                  <h2 className="text-gray-900 mt-4 text-center text-lg font-medium">
                    {category.name}
                  </h2>
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
