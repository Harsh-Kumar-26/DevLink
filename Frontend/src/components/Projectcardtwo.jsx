import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaRupeeSign,
  FaRegClock,
  FaFileAlt,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./loader";

const fallbackAvatar = "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png";

export default function ProjectCardtwo() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pjtid = queryParams.get("pjtid");

  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [creator, setCreator] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/send-project`,
          { projectid: pjtid },
          { withCredentials: true }
        );
        const userData = response.data.data;
        setProject(userData);

        const creatorRes = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/user-from-id`,
          { id: userData.creator },
          { withCredentials: true }
        );
        setCreator(creatorRes.data.data);
      } catch (err) {
        setError("Failed to fetch project");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (!project || !creator || isLoading) return <Loader />;

  const {
    pjt_name,
    money,
    deswritten,
    complete_date,
    specilities,
    bkphoto,
    createdAt,
    applied = [],
    description,
  } = project;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-8">
      {/* Back Button */}
      <Button variant="secondary"
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-gray-400 hover:text-white transition"
      >
        ← Back
      </Button>

      <motion.div
        className="max-w-3xl mx-auto bg-gradient-to-b from-white/5 to-white/0 bg-white/5 backdrop-blur-md border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Creator Info */}
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => navigate(`/profile?userid=${creator?._id}`)}
        >
          <img
            src={creator?.avatar || fallbackAvatar}
            alt="creator"
            className="w-12 h-12 rounded-full object-cover border border-purple-500"
          />
          <div>
            <p className="text-base font-medium text-purple-300">
              {creator?.fullname || "Unknown User"}
            </p>
            <p className="text-xs text-gray-400">
              Posted {formatDistanceToNow(new Date(createdAt))} ago
            </p>
          </div>
        </div>

        {/* Project Image */}
        {bkphoto && (
          <img
            src={bkphoto}
            alt="Project Background"
            className="w-full h-60 object-cover rounded-xl"
          />
        )}

        {/* Project Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-purple-400">
            {pjt_name}
          </h1>
          <p className="text-gray-300 leading-relaxed">{deswritten}</p>

          {description && (
            <a
              href={description}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-purple-300 text-sm hover:underline"
            >
              <FaFileAlt />
              View Full Description
            </a>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {specilities?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-purple-800/30 text-purple-300 px-3 py-1 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Budget & Deadline */}
        <div className="flex justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-purple-300" />
            <span>{money.toLocaleString()} INR</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRegClock className="text-purple-300" />
            <span>{new Date(complete_date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Applicants */}
        <div className="text-sm text-gray-400">
          Total applicants: <span className="font-semibold text-white">{applied.length}</span>
        </div>
      </motion.div>
    </div>
  );
}
