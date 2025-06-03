import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

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
  const [formData, setFormData] = useState({
    fullName: "Jane Doe",
    username: "jdoe123",
    email: "jane@example.com",
    avatar: null,
    description: "Frontend dev with a focus on UX & performance.",
    specialities: ["Frontend Developer", "UI/UX Designer"]
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", formData);
    // Submit logic to be handled by you
  };

  return (
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
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full"
            required
          />

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
            value={formData.description}
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
                  checked={formData.specialities.includes(spec)}
                  onChange={handleSpecialityChange}
                  className="accent-purple-600"
                />
                <span className="text-sm">{spec}</span>
              </label>
            ))}
          </div>
        </div>

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
