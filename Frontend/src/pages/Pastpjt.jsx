import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import { useLocation } from 'react-router-dom';

const testing = false;

const mockProjects = [
  {
    projectId: 'mock1',
    projectName: 'AI Chatbot',
    userId: 'user123',
    username: 'johndoe',
    codeLink: 'https://github.com/johndoe/chatbot',
    productLink: 'https://chatbot.example.com',
  },
  {
    projectId: 'mock2',
    pjt_name: 'Portfolio Website',
    userId: 'user456',
    username: 'janedoe',
    codeLink: 'https://github.com/janedoe/portfolio',
    productLink: 'https://janedoe.dev',
    reviewed:true,
    user_review:"This was a wonderful project well done guys",
    rating_user:4,
    paid:true,
    money:25600
  },
];

export default function Pstpjt() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReview, setActiveReview] = useState(null);
  const [activestatus, setActivestatus] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const navigate = useNavigate();
   const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const uid = queryParams.get("userid");

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        if (testing) {
          setProjects(mockProjects);
        } else {
          let userid;
          if(uid){
            userid=uid;
          }
          else{
            console.log("1");
          const userRes = await axios.get(
          `${import.meta.env.VITE_BACKENDURL}/current-user`,
          { withCredentials: true }
        );
        console.log("2");
        userid = userRes.data.data._id;
      }
        console.log("3");
          const res = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/userappliedprojects`,{userid},{withCredentials: true}
        );
        console.log("4");
            let filtered=[];
            console.log(res.data.data);
            
            filtered = res.data.data.filter((p) => (p.completed==true && p.accepted==true && p.acceptedId?.toString() == userid?.toString()));
            setProjects(filtered);
            console.log(filtered);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>

        <h2 className="text-3xl font-bold mb-6">My Current Projects</h2>

        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-[#1f2a41]">
            <table className="w-full text-sm text-left border-separate border-spacing-0">
              <thead className="text-gray-400 border-b border-gray-600">
                <tr>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Completion Date</th>
                  <th className="py-3 px-4">Submission Date</th>
                  
                  <th className="py-3 px-4">Payment Amount</th>
                  {/* <th className="py-3 px-4">Product Link</th> */}
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Review</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((pjt) => (
                  <>
                    <tr
                      key={pjt.projectId}
                      className="border-b border-gray-700 hover:bg-gray-800/40"
                    >
                      <td className="py-3 px-4 cursor-pointer hover-text-blue-500"><Link to={`/l?pjtid=${pjt.projectId}`}>{pjt.pjt_name}</Link></td>
                      <td className="py-3 px-4">
                        {new Date(pjt.com_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(pjt.final_date).toLocaleDateString()}
                      </td>
                      
                      <td><div className='text-green-500'>Rs. {pjt.money}</div></td>
                      <td>{pjt.paid?<div className='text-green-500'>Payment Done</div>:<div className='text-red-500'>Payment pending</div>}</td>
                      <td>{pjt.reviewed?<div className='text-[#FFD700]'>{pjt.rating_user} Star</div>:<div className='text-red-500'>Not Rated Yet</div>}</td>
                      <td className="py-3 px-4">
                        {pjt.reviewed?<div className="flex gap-2 flex-wrap">
                            <Button variant="green" onClick={() =>
                              setActiveReview(activeReview === pjt.projectId ? null : pjt.projectId)
                            }>See Review</Button>
                          
                        </div>:<div className='text-red-500'>Not Reviewed Yet</div>}
                      </td>
                    </tr>

                    {/* Review section as collapsible row */}
                    <AnimatePresence>
                      {activeReview === pjt.projectId && (
                        <tr key={`review-${pjt.projectId}`}>
                          <td colSpan={7} className="bg-[#2a3b5a] px-4 py-4">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <h4 className="text-lg font-semibold mb-2 text-black">Review By Clint</h4>
                              <div>{pjt.user_review}</div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
