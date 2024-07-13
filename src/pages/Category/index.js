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
    <div className="flex min-h-full w-full flex-col py-10">
      <h1 className="text-gray-900 text-center text-2xl font-bold leading-9 tracking-tight">
        Categories
      </h1>
      <div className="mt-5 w-full">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {categoryData.map((category, i) => (
            <Link
              key={category.name}
              to={`/service/${category.name.toLowerCase()}`}
            >
              <div className="bg-white h-60 cursor-pointer overflow-hidden rounded-lg shadow">
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="flex h-32 w-full items-center justify-center">
                    <img
                      // src={category.image}
                      src={`https://cdngarenanow-a.akamaihd.net/gstaticid/FF/crystalroyale/poke/${i + 1}.png`}
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
