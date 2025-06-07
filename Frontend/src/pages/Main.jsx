import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaPlus,
  FaList,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ProjectCard from "../components/Projectcard";
// import { defaultProject } from "../components/Projectcard";
import Button from "../components/Button";

// const dummyProjects = Array(6).fill(defaultProject);

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
    const [currentUser,setcurrentuser]=useState(null);
    useEffect(()=>{
        async function data(){
        try{
            const response = await axios.get(`${import.meta.env.VITE_BACKENDURL}/current-user`,{ withCredentials: true });
            let userData = response.data.data;
            setcurrentuser(userData);
        }
        catch(err){
            console.log(err);
        }
}
data();
},[]);
  const refresh=()=>{
    navigate(0);
  };
  const profile=()=>{
    navigate("/profile");
  }
  const handleLogout = () => {
    // logout logic here
    navigate("/login");
  };

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  };



  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay on small screens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black backdrop-blur-sm z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            <motion.nav
            overflow-y-auto
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 z-40 h-full w-72 bg-[linear-gradient(to_bottom,_#0e0e10,_#1a1c2c,_#0e0e10)] border-r border-gray-800 shadow-inner p-6 flex flex-col shadow-2xl rounded-tr-3xl rounded-br-3xl md:static md:shadow-none md:rounded-none"
            // bg-gradient-to-b from-[#121829] to-[#1f2a41]
            >
              <div className="flex justify-between items-center mb-8">
                <h1 onClick={refresh} className="text-4xl font-extrabold tracking-tight cursor-pointer">
                  Dev
                  <span className="text-purple-500 ml-1">Link</span>
                </h1>
                <button
                  className="md:hidden text-gray-400 hover:text-teal-400 transition"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                >
                  <FaTimes size={22} />
                </button>
              </div>

              <nav className="flex flex-col gap-3 text-lg font-medium">
                <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">
                  Client
                </p>
                <Link
                  to="/client/projects"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-teal-500/20 transition"
                >
                  <FaList className="text-teal-400" />
                  My Projects
                </Link>
                <Link
                  to="/client/new"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-teal-500/20 transition"
                >
                  <FaPlus className="text-teal-400" />
                  Post a Project
                </Link>

                <p className="text-sm text-gray-400 uppercase tracking-widest mt-6 mb-2">
                  Developer
                </p>
                <Link
                  to="/developer/find"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-teal-500/20 transition"
                >
                  <FaSearch className="text-teal-400" />
                  Find Work
                </Link>
                <Link
                  to="/developer/applications"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-teal-500/20 transition"
                >
                  <FaList className="text-teal-400" />
                  My Applications
                </Link>
              </nav>

              <div className="mt-auto pt-6 border-t border-teal-700 flex flex-col gap-3">
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-teal-500/20 transition"
                >
                  <FaCog className="text-teal-400" />
                  Settings
                </Link>
                <Link
                    to="/profile"
                    className="flex items-center gap-3 justify-center w-full"
                  >
                <Button variant="green" className="w-full flex items-center justify-center gap-3">
                  
                    <FaUser />
                    Profile
                </Button>
                  </Link>

                <Button
                  onClick={handleLogout}
                  variant="danger"
                  className="w-full flex items-center justify-center gap-3"
                >
                  <FaSignOutAlt />
                  Logout
                </Button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="bg-black flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className=" flex bg-gradient-to-t from-black to-[#1f2a41] items-center justify-between px-6 py-4 border-b border-teal-700 bg-[#122337] shadow-sm sticky top-0 z-10">
          {/* bg-gradient-to-b from-[#121829] to-[#1f2a41] */}
          <Button
            className="md:hidden text-teal-400 bg-transparent hover:bg-teal-500/20"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <FiMenu size={26} />
          </Button>

          <div onClick={profile} className="flex items-center gap-3 ml-auto cursor-pointer">
            <img
              src={
                currentUser?.avatar ||
                "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
              }
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-teal-400 object-cover shadow-md"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-semibold leading-none">
                {currentUser?.username || "User"}
              </span>
              <span className="text-teal-300 text-xs">Online</span>
            </div>
          </div>
        </header>

        {/* Projects & Outlet */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-[#0f0f0f] via-[#121829] to-[#1a1a1a]
">
          {/* {dummyProjects.map((proj, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.4 }}
              whileHover={{ scale: 1.03, boxShadow: "0 0 12px rgba(16, 185, 129, 0.6)" }}
              className="rounded-xl bg-gradient-to-r from-[#122337] to-[#1b2e4b] border border-teal-700 shadow-md cursor-pointer"
            >
              <ProjectCard project={proj} />
            </motion.div>
          ))} */}

          <Outlet />
        </main>
      </div>
    </div>
  );
}
