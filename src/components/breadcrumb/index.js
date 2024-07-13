import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

import { useAuth } from '../layout';

function Breadcrumb({ label }) {
  const { user } = useAuth();
  const href = user.is_owner ? '/service' : '/category';

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link to={href} className="text-primary">
        <Home className="h-4 w-4" strokeWidth={1.75} />
      </Link>
      <span>
        <ChevronRight className="h-3 w-3" />
      </span>
      <span className="text-gray-600">{label}</span>
    </div>
  );
}

export default Breadcrumb;
