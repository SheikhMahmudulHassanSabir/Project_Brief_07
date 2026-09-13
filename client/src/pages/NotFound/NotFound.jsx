import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

function NotFound() {
  return (
    <div className="page-wrapper flex items-center justify-center text-center py-16 px-6">
      <div className="card w-full p-12 max-w-lg">
        <div className="text-6xl font-extrabold text-accent mb-2 leading-none">
          404
        </div>
        <h1 className="text-3xl font-extrabold mb-3 text-primary">Page Not Found</h1>
        <p className="text-secondary mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/" className="btn btn-primary flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back to Homepage</span>
          </Link>
          <Link to="/jobs" className="btn btn-secondary flex items-center gap-2">
            <Search size={16} />
            <span>Browse Jobs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
