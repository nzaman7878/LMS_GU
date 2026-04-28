import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  
    const { backendUrl, isEducator, setEducatorData } = useContext(AppContext);
    
    const eToken = localStorage.getItem('educatorToken');

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        name: '',
        subject: '',
        qualification: '',
        experience: '',
        about: '',
        image: ''
    });

    const getProfileData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(backendUrl + '/api/educator/profile', { 
                headers: { etoken: eToken } 
            });
            
            if (data.success) {
                setProfileData(data.educator);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async () => {
        try {
            const formData = new FormData();
            formData.append('name', profileData.name);
            formData.append('subject', profileData.subject);
            formData.append('qualification', profileData.qualification);
            formData.append('experience', profileData.experience);
            formData.append('about', profileData.about);
            
            if (image) {
                formData.append('image', image);
            }

            const { data } = await axios.post(backendUrl + '/api/educator/update-profile', formData, { 
                headers: { etoken: eToken } 
            });
            
            if (data.success) {
                toast.success(data.message);
                
            
                localStorage.setItem("educatorData", JSON.stringify(data.educator)); 
                
         
                setEducatorData(data.educator);

                setIsEdit(false);
                setImage(false);
                getProfileData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (eToken) {
            getProfileData();
        }
    }, [eToken]);

    if (loading) {
        return (
            <div className='min-h-[80vh] flex items-center justify-center'>
                <div className='w-10 h-10 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin'></div>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-4 m-5'>
            <div className='flex flex-col gap-4 p-8 bg-white rounded-lg border max-w-2xl shadow-sm'>
                
                <div className='flex items-center gap-4'>
                    <label htmlFor="image" className='cursor-pointer relative'>
                        <img 
                            className='w-24 h-24 rounded-lg bg-gray-100 object-cover border' 
                            src={image ? URL.createObjectURL(image) : profileData.image} 
                            alt="Profile" 
                        />
                        {isEdit && (
                            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg'>
                                <p className='text-white text-[10px]'>Change</p>
                            </div>
                        )}
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden disabled={!isEdit} />
                    </label>
                    <div>
                        <p className='text-2xl font-semibold text-gray-800'>{profileData.name}</p>
                        <p className='text-indigo-600 font-medium'>{profileData.subject}</p>
                    </div>
                </div>

                <hr className='bg-gray-200 h-[1px] border-none' />

                <div className='grid grid-cols-[1fr_3fr] gap-y-4 text-gray-700 mt-2'>
                    <p className='font-medium'>Name:</p>
                    {isEdit 
                        ? <input className='bg-gray-50 border rounded px-2 py-1 outline-indigo-500' type="text" value={profileData.name} onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))} />
                        : <p>{profileData.name}</p>
                    }

                    <p className='font-medium'>Subject:</p>
                    {isEdit 
                        ? <input className='bg-gray-50 border rounded px-2 py-1 outline-indigo-500' type="text" value={profileData.subject} onChange={e => setProfileData(prev => ({ ...prev, subject: e.target.value }))} />
                        : <p>{profileData.subject}</p>
                    }

                    <p className='font-medium'>Qualification:</p>
                    {isEdit 
                        ? <input className='bg-gray-50 border rounded px-2 py-1 outline-indigo-500' type="text" value={profileData.qualification} onChange={e => setProfileData(prev => ({ ...prev, qualification: e.target.value }))} />
                        : <p>{profileData.qualification}</p>
                    }

                    <p className='font-medium'>Experience:</p>
                    {isEdit 
                        ? <input className='bg-gray-50 border rounded px-2 py-1 outline-indigo-500' type="text" value={profileData.experience} onChange={e => setProfileData(prev => ({ ...prev, experience: e.target.value }))} />
                        : <p>{profileData.experience}</p>
                    }

                    <p className='font-medium'>About Me:</p>
                    {isEdit 
                        ? <textarea className='bg-gray-50 border rounded px-2 py-1 outline-indigo-500 w-full' rows={4} value={profileData.about} onChange={e => setProfileData(prev => ({ ...prev, about: e.target.value }))} />
                        : <p className='text-sm text-gray-600 leading-6'>{profileData.about}</p>
                    }
                </div>

                <div className='mt-6'>
                    {isEdit 
                        ? <button onClick={updateProfile} className='px-8 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all'>Save Changes</button>
                        : <button onClick={() => setIsEdit(true)} className='px-8 py-2.5 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all'>Edit Profile</button>
                    }
                </div>
            </div>
        </div>
    );
};

export default MyProfile;