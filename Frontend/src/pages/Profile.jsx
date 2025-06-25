import React, { useState ,useEffect} from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaEdit, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../components/loader";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export default function ProfilePage() {
  const navigate=useNavigate();
   const { userid } = useParams();
  const back=()=>{
    if(!userid){
    navigate("/main");
    }
    else{
      navigate(-1);
    }
  }
  const [isloding,setisloding]=useState(false);
  const [user,setuser]=useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchUser() {
      try {
        setisloding(true);
        let response;
        if(!userid){
        response = await axios.get(
          `${import.meta.env.VITE_BACKENDURL}/current-user`,{ withCredentials: true });
        }
        else{
         response = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/user-from-id`,{id:userid},{ withCredentials: true }); 
        }
        let userData = response.data.data;
        setuser(userData);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError(err);
      } finally {
        setisloding(false);
      }
    }

    fetchUser();
  }, []);

  // if (isloding) return <div>Loading...</div>;

  // const user = {
  //   avatar: "https://i.pravatar.cc/150?img=12",
  //   fullName: "Jane Doe",
  //   username: "jdoe123",
  //   email: "jane@example.com",
  //   specialities: ["Frontend Developer", "UI/UX Designer"],
  //   avgRating: 4.7,
  //   description: "Passionate about clean design and performance-focused frontend development."
  // };

  return (isloding|| !user)?<Loader/>: (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-4xl bg-gray-900 text-white p-6 md:p-10 rounded-2xl shadow-2xl"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <img
            src={user.avatar || "https://res.cloudinary.com/dznit2e1x/image/upload/v1749028463/default-avatar-icon-of-social-media-user-vector_ge35qc.jpg"}
            alt="User Avatar"
            className="w-40 h-40 rounded-full object-cover border-4 border-purple-500 shadow-lg"
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-3xl font-bold">{user.fullname}</h2>
              <div className="flex gap-3">
                <Link to="/editprofile">
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                  <FaEdit /> Edit Profile
                </button>
                </Link>
                <button onClick={back} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition">
                  <FaArrowLeft /> Back
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm md:text-base">
              <p><strong>Username:</strong> @{user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Average Rating:</strong> {user.avgrating} <FaStar className="inline text-yellow-400 mb-1" /></p>

              <div>
                <strong>Specialities:</strong>
                {(user.specilities && user.specilities.length>0)?(
                <ul className="list-disc ml-6 mt-1">
                  {user.specilities.map((spec, idx) => (
                    <li key={idx}>{spec}</li>
                  ))}
                </ul>):(
                  <p className="ml-6 mt-1 text-gray-400">No specialities</p>
                )
}
              </div>

              <div>
                <strong>Description:</strong>
                <p className="mt-1 text-gray-300">{user.description}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
