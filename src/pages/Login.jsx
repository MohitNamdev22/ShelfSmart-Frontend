import React, { useState } from 'react';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/user/login', { email, password });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleLogin} className="p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <img 
            src="icon.png" 
            alt="ShelfSmart Icon" 
            className="w-10 h-10 sm:w-12 sm:h-12 mb-2" 
          />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">ShelfSmart</h2>
          <p className="text-xs sm:text-sm text-gray-500">Stay Stocked, Stay Smart</p>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 text-center">
          Login to your account
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 text-center">
          Access ShelfSmart to manage your kitchen efficiently
        </p>

        <div className="mb-3 sm:mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm sm:text-base"
            required
          />
        </div>

        <div className="mb-4 sm:mb-6 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sr-only">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm sm:text-base"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-3 sm:mb-4 text-sm sm:text-base">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 sm:p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center text-sm sm:text-base"
        >
          {loading ? (
            <>
              <svg 
                className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        <p className="text-center mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm">
          Don't have an account?{' '}
          <a 
            href="/register" 
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;