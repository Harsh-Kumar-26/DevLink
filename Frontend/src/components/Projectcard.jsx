import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRupeeSign,
  FaRegClock,
  FaUser,
  FaBookmark,
  FaRegBookmark,
  FaFileAlt,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import Button from "./Button";
import { useState , useEffect} from "react";
import Loader from "./loader";
import axios from "axios";

// Sample fallback image
const fallbackAvatar = "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png";

export default function ProjectCard({pjtid}) {
  const navigate=useNavigate();
    // console.log(pjtid);
    const [bookmarked, setBookmarked] = useState(false);
    const [isloding,setisloding]=useState(false);
    const [project,setproject]=useState(null);
    const [ap,setap]=useState(false);
        const [creator,setcreator]=useState(null);
    const [error,setError]=useState(null);
    const apply=async()=>{
      try{
          const respons = await axios.post(`${import.meta.env.VITE_BACKENDURL}/apply`,{projectid:_id},{ withCredentials: true });
          setap(true);
      }
      catch(err){
        console.log(err);
      }
    }
      useEffect(() => {
      async function fetchUser() {
        try {
            // console.log("Hello");
          setisloding(true);
          const response = await axios.post(`${import.meta.env.VITE_BACKENDURL}/send-project`,{projectid:pjtid},{ withCredentials: true }
          );
          let userData = response.data.data;
          // console.log(userData);
          setproject(userData);
          // console.log(userData.creator);
          const creatorres = await axios.post(`${import.meta.env.VITE_BACKENDURL}/user-from-id`,{id:userData.creator},{ withCredentials: true });
          // console.log(creatorres);
          let creatordata=creatorres.data.data;
          // console.log(creatordata);
          
          setcreator(creatordata);
        } catch (err) {
          setError("Failed to fetch user");
        }
        finally{
          setisloding(false);
        }
      }
      fetchUser();
    }, []);
    if(!project){
        return <Loader/>
    }
    const {
    _id,
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
  const toggleBookmark = () => setBookmarked(!bookmarked);

  return (isloding || !project || !creator)?<Loader/>:(
    <motion.div
  className="bg-gradient-to-b from-white/5 to-white/0 bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300 flex flex-col gap-4 mb-5"
    initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Creator Header */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={()=>{
        navigate(`/profile?userid=${creator?._id}`)
      }}>
        <img
          src={creator?.avatar || fallbackAvatar}
          alt="creator"
          className="w-10 h-10 rounded-full object-cover border border-purple-500"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-purple-300">
            {creator?.fullname || "Unknown User"}
          </span>
          <span className="text-xs text-gray-500">
            Posted {formatDistanceToNow(new Date(createdAt))} ago
          </span>
        </div>
      </div>

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

      {/* Bottom Actions */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-3">
          {/* <Link to={`/project/${_id}`}>
            <Button>View</Button>
          </Link> */}
          <Button onClick={apply} disabled={ap} variant={ap?"secondary":"green"}>{ap?"Applied":"Apply"}</Button>
        </div>
        <button
          onClick={toggleBookmark}
          className="text-purple-400 hover:text-purple-300 transition"
          title={bookmarked ? "Remove Bookmark" : "Bookmark"}
        >
          {bookmarked ? (
            <FaBookmark style={{ color: "red" }} size={18} />
          ) : (
            <FaRegBookmark size={18} />
          )}
        </button>
      </div>

      {/* Applied Users */}
       <div className="mt-4"><p className="text-sm text-gray-400 mb-2">Total applicants: {(applied?.length)||0}</p></div>
      
    </motion.div>
  );
}
