import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";
import axios from "axios";

const specialitiesList = [
  "Backend Developer", "Frontend Developer", "Full Stack Web Developer", "Android Developer",
  "iOS Developer", "Blockchain Developer", "Machine Learning Engineer", "Data Scientist",
  "DevOps Engineer", "Game Developer", "Cybersecurity Specialist", "AI Engineer",
  "UI/UX Designer", "Database Administrator", "AR/VR Developer", "Embedded Systems Engineer",
  "IoT Developer", "Cloud Solutions Architect", "Systems Engineer", "Site Reliability Engineer",
  "Desktop Application Developer", "Data Analyst", "QA Engineer", "Web3 Developer",
  "Computer Vision Engineer", "Mobile App Developer", "Network Engineer",
  "Product Manager", "Software Architect"
];

export default function EditProfilePage() {
  const navigate=useNavigate();
  const [isloding,setisloding]=useState(false);
    const [user, setuser]=useState();
    const [error, setError] = useState(null);
  useEffect(() => {
      async function fetchUser() {
        try {
          setisloding(true);
          const response = await axios.get(
            `${import.meta.env.VITE_BACKENDURL}/current-user`,
            { withCredentials: true } // important to send cookies
          );
          let userData = response.data.data;
          // console.log("Userdata1 "+userData);
          setuser(userData);
          // console.log("Userdata2 "+userData);
          
        } catch (err) {
          // console.error("Failed to fetch user:", err);
          setError("Failed to fetch user");
        }
        finally{
          setisloding(false);
        }
      }
      fetchUser();
    }, []);
  
  // const [formData, setFormData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files[0]) {
      // console.log("a1");
      setuser({ ...user, [name]: files[0] });
      // console.log("a2");
    } else {
      setuser({ ...user, [name]: value });
    }
  };

  const handleSpecialityChange = (e) => {
    const { value, checked } = e.target;
    setuser((prev) => {
      const updated = checked
        ? [...prev.specilities, value]
        : prev.specilities.filter((item) => item !== value);
      return { ...prev, specilities: updated };
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setisloding(true);
    // console.log("Updated Profile:", user);
     try {
      const data = new FormData();
      data.append("fullname", user.fullname);
      data.append("username", user.username);
      data.append("email", user.email);
      // data.append("password", user.password);
      data.append("description", user.description);
      if (user.avatar instanceof File) {
        // console.log("avatar");
        
  data.append("avatar", user.avatar);
  data.append("updateavatar", true);
} 
else {
  // console.log("No avatar");
  data.append("avatar",user.avatar);
  data.append("updateavatar", false);
}

      user.specilities.forEach((spec) => data.append("specilities", spec));

      const res = await axios.patch(`${import.meta.env.VITE_BACKENDURL}/edit-profile`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
     navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Editing profile failed");
    } finally {
      setisloding(false);
    }
    // Submit logic to be handled by you
  };

  return (isloding || !user)?(<Loader/>):(
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 px-4 py-10 flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-[1600px] bg-gray-900 text-white p-6 md:p-10 xl:p-14 rounded-2xl shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Edit Profile</h2>
          <button onClick={()=>window.history.back()}
            type="button"
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={user.fullname}
            onChange={handleChange}
            className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
            className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
            required
          />
          {user.avatar && (
  <div className="mb-4">
    <p className="mb-1">Current Avatar:</p>
    <img
      src={user.avatar}
      alt="Current avatar"
      className="w-24 h-24 object-cover rounded-full border-2 border-purple-500"
    />
  </div>
)}
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="bg-gray-800 p-3 rounded-lg outline-none file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 w-full"
          />

          <div className="w-full">
            {/* <label className="block mb-1 text-sm font-medium">Change Password</label> */}
            <Link to="/changepassword">
            <button
              type="button"
              className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 w-full rounded-lg font-semibold text-sm"
            >
              Change Password
            </button>
            </Link>
          </div>

          <textarea
            name="description"
            placeholder="Your Description"
            value={user.description}
            onChange={handleChange}
            rows="3"
            className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full lg:col-span-2"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-3 mt-6">
          <label className="block mb-2 font-semibold">Edit Specialities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 max-h-60 overflow-y-scroll bg-gray-800 p-3 rounded-lg">
            {specialitiesList.map((spec) => (
              <label key={spec} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={spec}
                  checked={user.specilities.includes(spec)}
                  onChange={handleSpecialityChange}
                  className="accent-purple-600"
                />
                <span className="text-sm">{spec}</span>
              </label>
            ))}
          </div>
        </div>
            {error && (
          <div className="mt-6 bg-red-800/60 text-red-200 border border-red-500 rounded-lg p-4 text-sm shadow-md">
            {error}
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="mt-8 w-full bg-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Save Changes
        </motion.button>
      </motion.form>
    </div>
  );
}
