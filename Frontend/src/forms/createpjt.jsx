import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Loader from "../components/loader";
import { specialitiesList } from "../Constants";
import axios from "axios";

export default function PostProject() {
  const [formData, setFormData] = useState({
    pjt_name: "",
    money: "",
    deswritten: "",
    complete_date: "",
    description: null,
    bkphoto: null,
    specilities: [],
  });

  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSpecialityChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev.specilities, value]
        : prev.specilities.filter((item) => item !== value);
      return { ...prev, specilities: updated };
    });
  };
// newproject
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setFormError("");
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("pjt_name", formData.pjt_name);
      data.append("money", formData.money);
      data.append("deswritten", formData.deswritten);
      data.append("complete_date", formData.complete_date);
    //   data.append("specilities", formData.specilities);
      if (formData.description) {
        data.append("description", formData.description);
      }
      if (formData.bkphoto) {
        data.append("bkphoto", formData.bkphoto);
      }
      formData.specilities.forEach((spec) => data.append("specilities", spec));
        console.log(data);
        const config = {
     headers: {
     "Content-Type": "multipart/form-data",
     },
     withCredentials: true,
    };
      const res = await axios.post(`${import.meta.env.VITE_BACKENDURL}/newproject`, data, config);
      navigate("/main");
    } catch (err) {
        console.log(err);
        
      setFormError(err.response?.data?.message || "Posting failed");
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
        className="w-full max-w-6xl bg-gray-900 text-white p-6 md:p-10 xl:p-14 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          <span>Post a </span><span className="text-purple-500">Project</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold">Project Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="pjt_name"
              value={formData.pjt_name}
              onChange={handleChange}
              placeholder="Enter project name"
              required
              className="bg-gray-800 p-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold">Budget (INR) <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="money"
              value={formData.money}
              onChange={handleChange}
              placeholder="Amount in ₹"
              required
              className="bg-gray-800 p-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold">Completion Deadline <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="complete_date"
              value={formData.complete_date}
              onChange={handleChange}
              required
              className="bg-gray-800 p-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold">Background Image (optional)</label>
            <input
              type="file"
              name="bkphoto"
              accept="image/*"
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded-lg outline-none file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 w-full"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold">Project Description File (optional)</label>
            <input
              type="file"
              name="description"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded-lg outline-none file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-gray-600 w-full"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold">Written Description <span className="font-normal text-green-400">(Max length:1000 characters) </span><span className="text-red-500">*</span></label>
            <textarea
              name="deswritten"
              value={formData.deswritten}
              onChange={handleChange}
              placeholder="Describe the project in detail..."
              rows={4}
              required
              className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold mb-2">Speciality Required<span className="text-red-500"> *</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2 max-h-60 overflow-y-scroll bg-gray-800 p-3 rounded-lg">
              {specialitiesList.map((spec) => (
                <label key={spec} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={spec}
                    checked={formData.specilities.includes(spec)}
                    onChange={handleSpecialityChange}
                    className="accent-blue-500"
                  />
                  <span className="text-sm">{spec}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {formError && (
          <div className="mt-6 bg-red-800/60 text-red-200 border border-red-500 rounded-lg p-4 text-sm shadow-md">
            {formError}
          </div>
        )}

        <motion.div className="mt-8 flex justify-end gap-4 flex-wrap">
          <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="green" type="submit">Submit Project</Button>
        </motion.div>
      </motion.form>
    </div>
  );
}
