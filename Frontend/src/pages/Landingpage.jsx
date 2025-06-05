import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import Footer from "../components/Landingfooter";
import Loader from "../components/loader";
import {Link} from "react-router-dom";
const refresh=()=>{
  window.location.reload();
    
}


export default function Landing() {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 md:px-12 py-4 relative z-20">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold cursor-context-menu"
          onClick={refresh}
        >
          Dev<span onClick={refresh} className="text-purple-500 cursor-context-menu">Link</span>
        </motion.div>

        {/* Desktop Nav */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex space-x-4 "
        >
          <Link to="/login">
          <Button variant="green">
            Login
          </Button>
          </Link>
         <Link to="/signup"><Button>Sign Up</Button></Link>
        </motion.div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-0 w-full bg-black bg-opacity-90 flex flex-col items-center space-y-4 py-4 z-10 md:hidden"
            >
              <Link to="/login">
              <Button
                variant="outline"
                className="w-11/12"
              >
                Login
              </Button>
              </Link>
              <Link to="/signup">
              <Button
                className="w-11/12"
              >
                Sign Up
              </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-16 md:py-32 relative z-10">
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 4, opacity: 0.15 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        {/* Content */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 z-10"
        >
          Connect With Developers.<br />
          Build Your <span className="text-purple-500">Dream Project.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 z-10 max-w-2xl"
        >
          Dev Link helps you turn ideas into code. Post a project OR Create other's project and earn.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="z-10"
        >
          <Link to="/signup">
          <Button>
            Get Started
          </Button>
          </Link>
        </motion.div>
      </div>
      <Footer/>
    </div>
  );
}
