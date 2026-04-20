import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <h1 className="text-8xl font-heading font-bold text-primary-500 mb-4">404</h1>
      <h2 className="text-2xl font-heading font-semibold text-neutral-800 mb-4">
        Page Not Found
      </h2>
      <p className="text-neutral-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
