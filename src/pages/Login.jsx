import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/login', { email, password });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-md">
        {/* Logo, App Name, and Tagline */}
        <div className="flex flex-col items-center mb-6">
          <img src="icon.png" alt="ShelfSmart Icon" className="w-12 h-12 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">ShelfSmart</h2>
          <p className="text-sm text-gray-500">Stay Stocked, Stay Smart</p>
        </div>

        {/* Form Title and Description */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
          Login to your account
        </h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Access ShelfSmart to manage your kitchen efficiently
        </p>

        {/* Form Fields */}
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            required
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            required
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
          ) : null}
          Login
        </button>

        {/* Register Link */}
        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;