import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center min-h-screen text-center mt-8 md:mt-12 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-4">The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 underline">Go to Home</Link>
    </div>
  );
};

export default NotFound;
