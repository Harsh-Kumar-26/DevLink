import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Button from "../components/Button";
import Loader from "../components/loader";

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
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    description: "",
    specialities: [],
  });

  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, avatar: files[0] || null });
    } else {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("description", formData.description);
      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }
      formData.specialities.forEach((spec) => data.append("specilities", spec));

      const res = await axios.post(`${import.meta.env.VITE_BACKENDURL}/signup`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await axios.post(`${import.meta.env.VITE_BACKENDURL}/login`, {
        username: formData.username,
        password: formData.password,
      }, { withCredentials: true });

      navigate("/profile");
    } catch (err) {
      setFormError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? <Loader /> : (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 px-4 py-10 flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[1600px] bg-gray-900 text-white p-6 md:p-10 xl:p-14 rounded-2xl shadow-2xl"
      >
        <div className="text-center sm:text-right mb-6">
          <p className="text-sm">
            Already have an account? <Link to="/login"><Button children="Login" /></Link>
          </p>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Sign Up for <span>Dev</span><span className="text-purple-500">Link</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Name, Username, Email */}
          {["fullname", "username", "email"].map((field) => (
            <div key={field}>
              <label className="block font-semibold capitalize">
                {field} <span className="text-red-500">*</span>
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
                required
              />
            </div>
          ))}

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
              At least 8 characters and include a special character.
            </p>
          </div>

          {/* Avatar */}
          <div>
            <label className="block font-semibold">Avatar (optional)</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded-lg outline-none file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 w-full"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={3}
              className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
              required
            />
          </div>

          {/* Specialities */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block font-semibold mb-2">
              Select Your Specialities <span className="text-gray-400">(optional)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2 max-h-60 overflow-y-scroll bg-gray-800 p-3 rounded-lg">
              {specialitiesList.map((spec) => (
                <label key={spec} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={spec}
                    checked={formData.specialities.includes(spec)}
                    onChange={handleSpecialityChange}
                    className="accent-purple-600"
                  />
                  <span className="text-sm">{spec}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {formError && (
          <div className="mt-6 bg-red-800/60 text-red-200 border border-red-500 rounded-lg p-4 text-sm shadow-md">
            {formError}
          </div>
        )}

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
  );
}
