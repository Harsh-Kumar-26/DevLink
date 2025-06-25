import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaRupeeSign,
  FaRegClock,
  FaFileAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import Loader from "./loader";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";


export default function ProjectCardt({ pjtid = "6837088589b3d5646e0db65e" }) {
  const navigate=useNavigate();
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
    description,
    selected,
    applied=[],
    accepted,
    completed
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
        <span className="text-xs text-gray-500">
                    Posted {formatDistanceToNow(new Date(createdAt))} ago
                  </span>

        {/* Description File Link */}
        {description && (
          <a
            href={description}
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

        {/* Selected Freelancer */}
        {accepted && (
          <div className="mt-3 text-green-400 text-sm">
            ✅ Selected: <Link to><span className="font-semibold">{selected}</span></Link>
          </div>
        )}
        {completed && (
          <div className="mt-3 text-green-400 text-sm">
            ✅ Project Finished
          </div>
        )}
        
        {/* Applied Freelancers */}
        {/* {apply?.length > 0 && (
          <div className="mt-2 text-sm text-purple-300">
            📝 Applied:
            <ul className="list-disc list-inside mt-1 space-y-1">
              {apply.map((user, idx) => (
                <li key={idx}>
                  {user}
                  {user === selected && (
                    <span className="text-green-400 ml-2 font-semibold">
                      (Selected)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>

      {/* Edit Button */}

      {/* {accepted?<div><Link><div></div></Link></div>:<></>} */}
      <div className="flex justify-end mt-4">
          <Button variant="danger" onClick={async()=>{
            const confirmed = window.confirm('Are you sure you want to delete this project?');
            if(confirmed){
              await axios.post(`${import.meta.env.VITE_BACKENDURL}/delete-project`,{projectid:_id},{ withCredentials: true });
              navigate(0);
              window.alert("Project deleted");  
            }
          }}>Delete</Button>
      </div>
           <div className="mt-4"><p className="text-sm text-gray-400 mb-2">Total applicants: {(applied?.length)||0}</p></div>  
    </motion.div>
  );
}
