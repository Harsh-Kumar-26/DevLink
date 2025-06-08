import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import Loader from "../components/loader";
import axios from 'axios';




export default function LoginPage() {
  const navigate=useNavigate();
  const [formError,setformError]=useState("");
  const [loginMode, setLoginMode] = useState("email"); // "username" or "email"
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(formData); // add login logic later
    try{
    const login=await axios.post(`${import.meta.env.VITE_BACKENDURL}/login`,formData,{
      withCredentials:true
    });
    navigate('/main');
    // console.log(login);
  }
  catch(err){
    // console.log(err);
    setformError(err.response?.data?.message || "Something went wrong");
  }
  finally{
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
        className="w-full max-w-lg bg-gray-900 text-white p-6 md:p-10 rounded-2xl shadow-2xl"
      >
        {/* Top Bar: Select + Signup */}
        <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4 sm:gap-0">
          {/* Dropdown on left */}
          <select
            value={loginMode}
            onChange={(e) => setLoginMode(e.target.value)}
            className="bg-gray-800 p-2 rounded-md outline-none cursor-pointer"
          >
            <option value="email">Email Login</option>
            <option value="username">Username Login</option>
          </select>

          {/* Signup Link */}
          <p className="text-sm">
            Don't have an account? <Link to="/signup"><Button children="Signup" /></Link>
          </p>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Login to <span>Dev</span><span className="text-purple-500">Link</span>
        </h2>

        {/* Input Fields */}
        <div className="flex flex-col gap-6">
          {loginMode === "username" ? (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
              required
            />
          ) : (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
              required
            />
          )}

          <div className="relative flex items-center">
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
        </div>
        {formError && (
  <div className="mt-6 bg-red-800/60 text-red-200 border border-red-500 rounded-lg p-4 text-sm shadow-md">
    <div>
      {formError}
      </div>
  </div>
)}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="mt-8 w-full bg-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Login
        </motion.button>
      </motion.form>
    </div>
  );
}
