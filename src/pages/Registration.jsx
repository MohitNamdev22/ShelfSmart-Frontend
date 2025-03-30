import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8080/user/register', {
        name,
        email,
        password,
      });
      setSuccess('Account created successfully! Please log in.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 px-4 sm:px-6 lg:px-8 py-6">
      <form
        onSubmit={handleRegister}
        className="p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <img 
            src="icon.png" 
            alt="ShelfSmart Icon" 
            className="w-16 h-16 sm:w-20 sm:h-20 mb-2" 
          />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">ShelfSmart</h2>
          <p className="text-xs sm:text-sm text-gray-500">Stay Stocked, Stay Smart</p>
        </div>

        {success && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-green-100 text-green-700 text-center rounded-lg text-sm sm:text-base">
            {success}
          </div>
        )}

        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 text-center">
          Create your account
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 text-center">
          Join ShelfSmart to manage your kitchen efficiently
        </p>

        <div className="mb-3 sm:mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 sr-only">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm sm:text-base"
            required
          />
        </div>

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

        <div className="mb-4 sm:mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm sm:text-base"
            required
          />
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
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <p className="text-center mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm">
          Already have an account?{' '}
          <a 
            href="/login" 
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;