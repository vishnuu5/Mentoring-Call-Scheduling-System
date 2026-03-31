import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLES } from '../../utils/constants.js';

export const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ROLES.USER,
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.password) {
      setFormError('Email and password are required');
      return;
    }

    try {
      await login(formData.email, formData.password, formData.role);
      switch (formData.role) {
        case ROLES.ADMIN:
          navigate('/admin');
          break;
        case ROLES.MENTOR:
          navigate('/mentor');
          break;
        default:
          navigate('/user');
      }
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Mentoring Scheduler</h1>

        {error && <div className="alert alert-error mb-4">{error}</div>}
        {formError && <div className="alert alert-error mb-4">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={ROLES.USER}>User</option>
              <option value={ROLES.MENTOR}>Mentor</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-300">
          <p className="text-sm text-gray-600 mb-4 font-semibold">Demo Credentials:</p>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-700">Admin</p>
              <p className="text-gray-500">admin@example.com / admin123</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">User</p>
              <p className="text-gray-500">user1@example.com / user123</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Mentor</p>
              <p className="text-gray-500">mentor1@example.com / mentor123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
