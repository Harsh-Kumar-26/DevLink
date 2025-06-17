import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Footer from "../components/Landingfooter";
import UserProjectsList from '../components/Userpjtdata.jsx'

export default function MyProjects() {
  const [selectedTab, setSelectedTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabs = [
    { key: "all", label: "All Projects" },
    { key: "accepted", label: "Accepted Projects" },
    { key: "completed", label: "Completed Projects" },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case "all":
        return <><div><UserProjectsList pjtkey="all"/></div></>;
      case "accepted":
        return <><div><UserProjectsList pjtkey="accepted"/></div></>;
      case "completed":
        return <><div><UserProjectsList pjtkey="completed"/></div></>;
      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-12 py-4 relative z-20">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-semibold text-purple-400 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          ← Back
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-white"
        >
          My <span className="text-purple-500">Projects</span>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col w-full px-4 sm:px-6 md:px-12">
        {/* Tabs */}
        <div className="w-full max-w-6xl mx-auto flex justify-center flex-wrap gap-4 mt-8 mb-6">
          {tabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTab(tab.key)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedTab === tab.key
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-purple-700 hover:text-white"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-6xl mx-auto py-6 flex-grow"
        >
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {renderContent()}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
