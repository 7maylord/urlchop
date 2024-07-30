import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setError(null);
      setSuccess('Login successful! Redirecting to shorten URL page...');
      setTimeout(() => {
        navigate('/shorten');
      }, 1000); // Redirect after 1 seconds
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please try again.');
      setSuccess(null);
      setEmail('');
      setPassword('');
    }
  };

    return (
    <div className="flex flex-col items-center min-h-screen mt-8 md:mt-12 bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full p-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full p-3 border rounded"
          required
        />
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className= "text-left pb-2 text-1xl font-extralight">If you do not have an existing account, create an account <Link className= "font-normal" to={"/register"}>here</Link>.</p>
      </form>    
    </div>
  );
};

export default Login;
