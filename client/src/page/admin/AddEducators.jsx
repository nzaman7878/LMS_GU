import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import this
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const AddEducators = () => {
  const { backendUrl, navigate } = useAppContext();
  const { id } = useParams(); // Get ID from URL
  const isEditMode = !!id;

  const [image, setImage] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing data if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchEducatorData = async () => {
        try {
          const token = localStorage.getItem('adminToken');
          const { data } = await axios.get(`${backendUrl}/api/admin/all-educators`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (data.success) {
            const educator = data.educators.find(item => item._id === id);
            if (educator) {
              setName(educator.name);
              setEmail(educator.email);
              setSubject(educator.subject);
              setQualification(educator.qualification);
              setExperience(educator.experience);
              setAbout(educator.about);
              // Note: Password is left empty for security/optional update
            }
          }
        } catch (error) {
          toast.error("Failed to load educator data");
        }
      };
      fetchEducatorData();
    }
  }, [id, isEditMode, backendUrl]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      if (image) formData.append('image', image);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password); // Optional in edit mode
      formData.append('subject', subject);
      formData.append('qualification', qualification);
      formData.append('experience', experience);
      formData.append('about', about);
      
      if (isEditMode) formData.append('userId', id);

      const token = localStorage.getItem('adminToken');
      
      // Determine if we call Add or Update API
      const endpoint = isEditMode ? '/api/admin/update-educator' : '/api/admin/add-educator';
      
      const { data } = await axios.post(`${backendUrl}${endpoint}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        navigate('/admin/manage-educators'); // Go back to list
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
    <form onSubmit={onSubmitHandler} className='m-5 w-full max-w-4xl'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        {isEditMode ? 'Edit Educator' : 'Add New Educator'}
      </h2>
      
      <div className='bg-white p-8 border rounded-xl shadow-sm'>
        
 <div className='bg-white p-8 border rounded-xl shadow-sm'>
        
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="educator-img">
            <img 
              className='w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover border-2 border-indigo-100' 
              src={image ? URL.createObjectURL(image) : assets.upload_area} 
              alt="" 
            />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="educator-img" hidden />
          <p className='text-sm'>Upload Educator <br /> Profile Picture</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
       
          <div className='space-y-4'>
            <div>
              <p className='mb-1 font-medium'>Educator Name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2 w-full focus:ring-1 focus:ring-indigo-500 outline-none' type="text" placeholder='Full Name' required />
            </div>
            <div>
              <p className='mb-1 font-medium'>Educator Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2 w-full focus:ring-1 focus:ring-indigo-500 outline-none' type="email" placeholder='Email ID' required />
            </div>
            <div>
              <p className='mb-1 font-medium'>Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2 w-full focus:ring-1 focus:ring-indigo-500 outline-none' type="password" placeholder='Password' required />
            </div>
            <div>
              <p className='mb-1 font-medium'>Experience</p>
              <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2 w-full'>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(yr => (
                  <option key={yr} value={`${yr} Year`}>{yr} Year</option>
                ))}
              </select>
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <p className='mb-1 font-medium'>Subject</p>
              <input onChange={(e) => setSubject(e.target.value)} value={subject} className='border rounded px-3 py-2 w-full' type="text" placeholder='e.g. Computer Science' required />
            </div>
            <div>
              <p className='mb-1 font-medium'>Qualification</p>
              <input onChange={(e) => setQualification(e.target.value)} value={qualification} className='border rounded px-3 py-2 w-full' type="text" placeholder='e.g. M.Tech / PhD' required />
            </div>
            <div>
              <p className='mb-1 font-medium'>About Educator</p>
              <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='border rounded px-3 py-2 w-full' placeholder='Write something about the educator...' rows={4} required />
            </div>
          </div>
        </div>


      </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className='bg-indigo-600 w-full md:w-48 mt-8 text-white px-10 py-3 rounded-full hover:bg-indigo-700 transition-all font-bold'
        >
          {loading ? "Processing..." : (isEditMode ? "Update Educator" : "Add Educator")}
        </button>
      </div>
    </form>
  );
};

export default AddEducators;
