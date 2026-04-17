import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddEducators = () => {
  const { backendUrl } = useAppContext();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-educator`, 
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Educator added successfully!");
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10 min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Educator</h2>
          <p className="text-gray-500 text-sm">Register a new instructor to the platform.</p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Dr. Jane Smith"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="jane@lms.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-bold transition-all duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {loading ? 'Registering...' : 'Add Educator'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEducators;