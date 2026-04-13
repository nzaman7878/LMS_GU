import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import StudentLayout from "../../components/students/StudentLayout";
import { User, Mail, ShieldCheck, MapPin, Edit3, Phone, School, GraduationCap, Save, X, Camera } from "lucide-react";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { student, updateProfile } = useAppContext();
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false); 
  const [formData, setFormData] = useState({});


  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        gender: student.gender || "Male",
        mobile: student.mobile || "",
        university: student.university || "",
        education: student.education || "",
        address: student.address || "",
      });
    }
  }, [student]);

  const handleUpdate = async () => {
    try {
     
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("gender", formData.gender);
      dataToSend.append("mobile", formData.mobile);
      dataToSend.append("university", formData.university);
      dataToSend.append("education", formData.education);
      dataToSend.append("address", formData.address);

      if (image) {
        dataToSend.append("image", image);
      }

      const res = await updateProfile(dataToSend);
      
      if (res.success) {
        toast.success("Profile Updated!");
        setIsEdit(false);
        setImage(false); 
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
          {isEdit ? (
            <div className="flex gap-3">
              <button 
                onClick={() => { setIsEdit(false); setImage(false); }} 
                className="flex items-center gap-2 bg-gray-100 text-gray-600 px-5 py-2 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                <X size={18} /> Cancel
              </button>
              <button 
                onClick={handleUpdate} 
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEdit(true)} 
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-all text-sm shadow-md"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
          
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row md:items-end -mt-12 gap-6 mb-8">
              {/* Profile Avatar with Image Upload Logic */}
              <div className="relative group w-32 h-32">
                <label htmlFor="profile-pic" className={isEdit ? "cursor-pointer" : ""}>
                  <div className="w-32 h-32 bg-white rounded-2xl p-1 shadow-xl ring-4 ring-white">
                    <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                      {image ? (
                        <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                      ) : student?.image ? (
                        <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={64} className="text-blue-600" />
                      )}
                    </div>
                  </div>
                  
                  {isEdit && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera size={24} />
                      <span className="text-[10px] font-bold mt-1 uppercase">Change</span>
                    </div>
                  )}
                </label>
                <input 
                  type="file" 
                  id="profile-pic" 
                  hidden 
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  disabled={!isEdit}
                />
              </div>

              <div className="flex-1 pb-1">
                {isEdit ? (
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-blue-600 uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 outline-none w-full max-w-sm bg-blue-50/50 px-2 py-1 rounded-t-md" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900">{student?.name}</h2>
                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                       <ShieldCheck size={16} className="text-emerald-500" /> 
                       Verified Student Account
                    </p>
                  </>
                )}
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <EditableField isEdit={isEdit} label="Gender" value={formData.gender} icon={<User size={20} className="text-cyan-500" />} type="select" options={["Male", "Female", "Other"]} onChange={(val) => setFormData({...formData, gender: val})} />
              <EditableField isEdit={isEdit} label="Mobile" value={formData.mobile} icon={<Phone size={20} className="text-emerald-500" />} onChange={(val) => setFormData({...formData, mobile: val})} />
              <EditableField isEdit={isEdit} label="University" value={formData.university} icon={<School size={20} className="text-purple-500" />} onChange={(val) => setFormData({...formData, university: val})} />
              <EditableField isEdit={isEdit} label="Education" value={formData.education} icon={<GraduationCap size={20} className="text-orange-500" />} onChange={(val) => setFormData({...formData, education: val})} />
              <EditableField isEdit={isEdit} label="Address" value={formData.address} icon={<MapPin size={20} className="text-pink-500" />} type="textarea" onChange={(val) => setFormData({...formData, address: val})} />
              
              <div className="flex items-start gap-4 p-2 opacity-60">
                <div className="mt-1 bg-white p-2 rounded-lg shadow-sm border border-gray-50">
                  <Mail size={20} className="text-red-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address (Locked)</p>
                  <p className="text-gray-900 font-semibold">{student?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

const EditableField = ({ isEdit, label, value, icon, onChange, type = "text", options = [] }) => (
  <div className={`flex items-start gap-4 p-3 rounded-2xl transition-all ${isEdit ? "bg-blue-50/30 ring-1 ring-blue-100" : "hover:bg-gray-50"}`}>
    <div className="mt-1 bg-white p-2 rounded-xl shadow-sm border border-gray-100">{icon}</div>
    <div className="flex-1">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      {isEdit ? (
        type === "select" ? (
          <select 
            className="w-full bg-transparent border-b border-blue-300 py-1 outline-none font-semibold text-gray-900" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
          >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input 
            type="text" 
            className="w-full bg-transparent border-b border-blue-300 py-1 outline-none font-semibold text-gray-900 focus:border-blue-600 transition-colors" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
          />
        )
      ) : (
        <p className="text-gray-900 font-semibold">{value || "Not provided"}</p>
      )}
    </div>
  </div>
);

export default MyProfile;