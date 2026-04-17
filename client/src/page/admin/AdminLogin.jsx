import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const {  navigate, loginAdmin } = useAppContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    const response = await loginAdmin(email, password);

    if (response.success) {
      toast.success("Admin Logged In");
      navigate('/admin'); 
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Admin Login</h2>
        
        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
          >
            Login as Admin
          </button>
        </form>
        
        <p className="mt-4 text-xs text-center text-gray-500">
          Authorized Access Only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;