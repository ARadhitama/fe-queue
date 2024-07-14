import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '../../components/layout';
import Breadcrumb from '../../components/breadcrumb';

import { getHistories } from '../../services';

function HistoryPage() {
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const generateColor = (status) => {
    if (status === 'accepted') return 'bg-green-100 text-green-800';
    if (status === 'rejected') return 'bg-red-100 text-red-800';
    if (status === 'canceled') return 'bg-gray-100 text-gray-800';

    return 'bg-green-100 text-green-800';
  };

  const [isFetched, setIsFetched] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const histories = await getHistories();
        setIsFetched(true);
        setHistoryData(histories);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchHistory();
  }, [user]);

  if (!isFetched) {
    return null;
  }

  if (historyData.length === 0) {
    return (
      <div className="flex min-h-full w-full flex-col pb-10 pt-7">
        <Breadcrumb label="History" />
        <div className="text-gray-900 mb-2 mt-5 text-center text-2xl font-bold leading-9 tracking-tight">
          History not found
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col pb-10 pt-7">
      <Breadcrumb label="History" />
      <div className="text-gray-900 mb-2 mt-5 text-center text-2xl font-bold leading-9 tracking-tight">
        History
      </div>
      <div className="mt-5 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="border-gray-200 overflow-hidden border-b sm:rounded-lg">
              <table className="divide-gray-200 w-full divide-y">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="text-gray-900 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="text-gray-900 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="text-gray-900 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="text-gray-900 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-gray-200 divide-y">
                  {historyData.map((history, i) => (
                    <tr key={i}>
                      <td className="text-gray-900 w-[25%] whitespace-nowrap px-6 py-4 text-sm">
                        {formatDate(history.created_at)}
                      </td>
                      <td className="text-gray-900 w-[20%] whitespace-nowrap px-6 py-4 text-sm">
                        {history.category}
                      </td>
                      <td className="text-gray-900 w-[45%] whitespace-nowrap px-6 py-4 text-sm">
                        {history.name}
                      </td>
                      <td className="w-[20%] whitespace-nowrap px-6 py-4">
                        {history.status && (
                          <span
                            className={`${generateColor(history.status)} inline-flex rounded-full px-3 py-1 text-xs font-semibold`}
                          >
                            {history.status.toUpperCase()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
