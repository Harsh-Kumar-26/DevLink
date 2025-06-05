import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft,FaEye,FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";
import axios from "axios";

export default function ChangePasswordPage() {
    const navigate=useNavigate();
  const [error,seterror]=useState(null);
  const [isloding,setisloding]=useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Change Password Data:", formData);
    if(formData.newPassword===formData.confirmPassword){
      setisloding(true);
         try{
      const data= {newpassword:formData.newPassword,oldpassword:formData.oldPassword};
      // console.log("Data ",data);
      const res = await axios.patch(`${import.meta.env.VITE_BACKENDURL}/edit-profile`, data,{withCredentials: true,
      });
     navigate("/profile");
    } catch (err) {
      seterror(err.response?.data?.message || "Editing profile failed");
    } finally {
      setisloding(false);
    }
  }
  else{
    // console.log("Not equal");
    seterror("New password & Confirm password does not match");
  }
    // Add your own password update logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 px-4 py-10 flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-gray-900 text-white p-6 md:p-10 rounded-2xl shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Change Password</h2>
          <button onClick={()=>window.history.back()}
            type="button"
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Old Password */}
          <div className="relative flex items-center">
            <input
              type={showPasswords.old ? "text" : "password"}
              name="oldPassword"
              placeholder="Old Password"
              value={formData.oldPassword}
              onChange={handleChange}
              className="bg-gray-800 p-3 pr-12 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
              required
            />
            <button
              type="button"
              onClick={() => toggleVisibility("old")}
              className="absolute right-3 text-purple-400 hover:text-purple-200"
            >
              {showPasswords.old ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative flex items-center">
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="bg-gray-800 p-3 pr-12 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
              required
            />
            <button
              type="button"
              onClick={() => toggleVisibility("new")}
              className="absolute right-3 text-purple-400 hover:text-purple-200"
            >
              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative flex items-center">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-gray-800 p-3 pr-12 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
              required
            />
            <button
              type="button"
              onClick={() => toggleVisibility("confirm")}
              className="absolute right-3 text-purple-400 hover:text-purple-200"
            >
              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
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
          Update Password
        </motion.button>
      </motion.form>
    </div>
  );
}
