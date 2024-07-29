import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-4">The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 underline">Go to Home</Link>
    </div>
  );
};

export default NotFound;
