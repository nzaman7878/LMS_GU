import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageEducators = () => {
  const { backendUrl } = useAppContext();
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const fetchEducators = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/all-educators`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        setEducators(data.educators);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

 
  const removeEducator = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this educator? This action cannot be undone.",
      )
    )
      return;

    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.post(
        `${backendUrl}/api/admin/delete-educator`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
       
        setEducators((prev) => prev.filter((item) => item._id !== userId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchEducators();
  }, []);

 
  const filteredEducators = educators.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Educators</h2>
          <p className="text-sm text-gray-500">
            Total Educators:{" "}
            <span className="font-semibold text-indigo-600">
              {educators.length}
            </span>
          </p>
        </div>
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full md:w-64 border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b">
              <th className="py-4 px-4">Educator Info</th>
              <th className="py-4 px-4">Subject</th>
              <th className="py-4 px-4">Qualification</th>
              <th className="py-4 px-4">Experience</th>
              <th className="py-4 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-400">
                  Loading educators...
                </td>
              </tr>
            ) : filteredEducators.length > 0 ? (
              filteredEducators.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`${backendUrl}/images/${item.image}`}
                        
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover bg-gray-100 border"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/40";
                        }}
                      />
                      <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
                      {item.subject || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 italic">
                    {item.qualification || "N/A"}
                  </td>
                  <td className="py-4 px-4 font-medium">
                    {item.experience || "0 Years"}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={() =>
                          navigate(`/admin/edit-educator/${item._id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => removeEducator(item._id)}
                        className="text-red-500 hover:text-red-700 font-semibold border border-red-200 px-3 py-1 rounded-md hover:bg-red-50 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-10 text-center text-gray-400 italic"
                >
                  No educators found matchings your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEducators;
