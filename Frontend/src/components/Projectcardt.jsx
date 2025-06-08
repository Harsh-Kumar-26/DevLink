import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaRupeeSign,
  FaRegClock,
  FaFileAlt,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import Button from "./Button";
import { useState, useEffect } from "react";
import Loader from "./loader";
import axios from "axios";

export default function ProjectCardt({ pjtid="6837088589b3d5646e0db65e" }) {
  const [isloding, setisloding] = useState(false);
  const [project, setproject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setisloding(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/send-project`,
          { projectid: pjtid },
          { withCredentials: true }
        );
        setproject(response.data.data);
      } catch (err) {
        setError("Failed to fetch project");
      } finally {
        setisloding(false);
      }
    }
    fetchUser();
  }, []);

  if (!project) return <Loader />;

  const {
    _id,
    pjt_name,
    money,
    deswritten,
    complete_date,
    specilities,
    bkphoto,
    createdAt,
    descriptionFile,
  } = project;

  return isloding ? (
    <Loader />
  ) : (
    <motion.div
      className="bg-gradient-to-b from-white/5 to-white/0 bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300 flex flex-col gap-4 mb-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background Image */}
      {bkphoto && (
        <img
          src={bkphoto}
          alt="project background"
          className="rounded-xl h-48 w-full object-cover"
        />
      )}

      {/* Project Info */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-purple-400">{pjt_name}</h2>
        <p className="text-sm text-gray-300 line-clamp-4">{deswritten}</p>

        {/* Description File Link */}
        {descriptionFile && (
          <a
            href={descriptionFile}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-purple-400 mt-1 text-sm hover:underline"
            title="View Project Description File"
          >
            <FaFileAlt />
            <span>Description File</span>
          </a>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {specilities?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-purple-800/30 text-purple-300 px-2 py-1 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Budget & Deadline */}
        <div className="flex flex-wrap justify-between text-sm text-gray-400 mt-4">
          <div className="flex items-center gap-1">
            <FaRupeeSign className="text-purple-400" />
            {money.toLocaleString()} INR
          </div>
          <div className="flex items-center gap-1">
            <FaRegClock className="text-purple-400" />
            {new Date(complete_date).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="flex justify-end mt-4">
        <Link to={`/edit-project/${_id}`}>
          <Button variant="green">Edit</Button>
        </Link>
      </div>
    </motion.div>
  );
}
