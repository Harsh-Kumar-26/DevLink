import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../components/Button";
import axios from 'axios';
import Loader from "../components/loader";
import {useNavigate} from "react-router-dom";


const specialitiesList = [
  "Backend Developer", "Frontend Developer", "Full Stack Web Developer", "Android Developer",
  "iOS Developer", "Blockchain Developer", "Machine Learning Engineer", "Data Scientist",
  "DevOps Engineer", "Game Developer", "Cybersecurity Specialist", "AI Engineer", "UI/UX Designer",
  "Database Administrator", "AR/VR Developer", "Embedded Systems Engineer", "IoT Developer",
  "Cloud Solutions Architect", "Systems Engineer", "Site Reliability Engineer",
  "Desktop Application Developer", "Data Analyst", "QA Engineer", "Web3 Developer",
  "Computer Vision Engineer", "Mobile App Developer", "Network Engineer", "Product Manager",
  "Software Architect"
];

export default function SignupPage() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    description: "",
    specialities: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if(files[0]){
      setFormData({ ...formData, [name]: files[0]});
      }
      else{
        
        setFormData({ ...formData, [name]: null});
      }
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSpecialityChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev.specialities, value]
        : prev.specialities.filter((item) => item !== value);
      return { ...prev, specialities: updated };
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    try{
      const formDataToSend = new FormData();
      if(!formData.avatar){
      const av=await fetch("/avatar.jpg");
        const blob=await av.blob();
        const file = new File([blob], 'avatar.jpg', { type: blob.type });
        // setFormData({ ...formData, avatar: file });
        formDataToSend.append("avatar", file);
      }

      console.log(formData);
      try{
    const response=await axios.post(`${import.meta.env.VITE_BACKENDURL}/signup`,formData);
    console.log(response);
      }
      catch(err){
        console.error(err);
        
      }
    navigate('/login');
    // window.location.href="https://example.com";
    
    }

    catch(err){
      console.error(err);
      
    }finally{
      setIsLoading(false);
    }
  };

  return isLoading?(<Loader/>):(
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 px-4 py-10 flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[1600px] bg-gray-900 text-white p-6 md:p-10 xl:p-14 rounded-2xl shadow-2xl"
      >
        {/* Login link */}
        <div className="text-center sm:text-right mb-6">
          <p className="text-sm">
            Already have an account? <Button children="Login" />
          </p>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Sign Up for <span>Dev</span><span className="text-purple-500">Link</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Full Name */}
          <div>
            <label className="block font-semibold">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block font-semibold">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Unique Username"
              value={formData.username}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Username must be unique</p>
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
              required
            />
          </div>

          {/* Password */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block font-semibold">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-800 p-3 pr-12 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-purple-400 hover:text-purple-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Password must be at least 8 characters long with a special character.
            </p>
          </div>

          {/* Avatar (Optional) */}
          <div>
            <label className="block font-semibold">
              Avatar <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded-lg outline-none file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 w-full"
            />
          </div>

          {/* Description (Optional) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block font-semibold">
              Brief Description
            </label>
            <textarea
              name="description"
              placeholder="Tell us about yourself"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />
          </div>

          {/* Specialities */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-semibold">
              Select Your Specialities <span className="text-gray-400">(optional)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 max-h-60 overflow-y-scroll bg-gray-800 p-3 rounded-lg">
              {specialitiesList.map((spec) => (
                <label key={spec} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={spec}
                    checked={formData.specialities.includes(spec)}
                    onChange={handleSpecialityChange}
                    className="accent-purple-600 cursor-pointer hover:"
                  />
                  <span className="text-sm">{spec}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="mt-8 w-full bg-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Create Account
        </motion.button>
      </motion.form>
    </div>
  )
}
