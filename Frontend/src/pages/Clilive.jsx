import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';

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
    projectName: 'Portfolio Website',
    userId: 'user456',
    username: 'janedoe',
    codeLink: 'https://github.com/janedoe/portfolio',
    productLink: 'https://janedoe.dev',
  },
];

export default function Cliveproject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReview, setActiveReview] = useState(null);
  const [activestatus, setActivestatus] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        if (testing) {
          setProjects(mockProjects);
        } else {
            console.log("1");
          const userRes = await axios.get(
          `${import.meta.env.VITE_BACKENDURL}/current-user`,
          { withCredentials: true }
        );
        console.log("2");
        const userid = userRes.data.data._id;
        console.log("3");
          const res = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/usercreatedprojects`,{userid},{withCredentials: true}
        );
        console.log("4");
            let filtered=[];
            console.log(res.data.data);
            
            filtered = res.data.data.filter((p) => (p.completed==false && p.accepted==true));
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

//   const handleReviewChange = (projectId, field, value) => {
//     setReviewInputs((prev) => ({
//       ...prev,
//       [projectId]: {
//         ...prev[projectId],
//         [field]: value,
//       },
//     }));
//   };

//   const updatestatus = async (projectId, userId) => {
//     const reviewData = reviewInputs[projectId] || {};
//     if (!reviewData.status) {
//       alert("Please provide status.");
//       return;
//     }

//     try {
//       if (!testing) {
//         console.log(projectId);
        
//         await axios.post(
//           `${import.meta.env.VITE_BACKENDURL}/updatestatus`,
//           {
//             projectid:projectId,
//             status:reviewData.status
//           },
//           { withCredentials: true }
//         );
//         navigate(0);
//       } else {
//         console.log('Mock submit:', { projectId, userId, ...reviewData });
//       }
//       alert('Status Updated!');
//       setActivestatus(null);
//     } catch (err) {
//       console.error('Failed to update status:', err);
//       alert('Could not update status.');
//     }
//   };

//   const submitReview = async (projectId, userId) => {
//     const reviewData = reviewInputs[projectId] || {};
//     if (!reviewData.code || !reviewData.pdt) {
//       alert("Please provide both code link and product link.");
//       return;
//     }

//     try {
//       if (!testing) {
//         console.log(projectId);
        
//         await axios.post(
//           `${import.meta.env.VITE_BACKENDURL}/complete`,
//           {
//             projectid:projectId,
//             code_link: reviewData.code,
//             pdt_link: reviewData.pdt,
//           },
//           { withCredentials: true }
//         );
//         navigate(0);
//       } else {
//         console.log('Mock submit:', { projectId, userId, ...reviewData });
//       }
//       alert('Project submitted!');
//       setActiveReview(null);
//     } catch (err) {
//       console.error('Failed to submit Project:', err);
//       alert('Could not submit Project.');
//     }
//   };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>

        <h2 className="text-3xl font-bold mb-6">🔴 Live Projects</h2>

        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-[#1f2a41]">
            <table className="w-full text-sm text-left border-separate border-spacing-0">
              <thead className="text-gray-400 border-b border-gray-600">
                <tr>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Completion Date</th>
                  <th className="py-3 px-4">Status(%)</th>
                  {/* <th className="py-3 px-4">Product Link</th> */}
                  {/* <th className="py-3 px-4">Actions</th> */}
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
                        {pjt.status}
                      </td>
                      {/* <td className="py-3 px-4">
                        <div className="flex gap-2 flex-wrap">
                          
                            <Button onClick={()=>setActivestatus(activestatus === pjt.projectId ? null : pjt.projectId)
                            }>Edit Status</Button>
                            <Button variant="green" onClick={() =>
                              setActiveReview(activeReview === pjt.projectId ? null : pjt.projectId)
                            }>Submit Project</Button>
                          
                        </div>
                      </td> */}
                    </tr>

                    {/* Review section as collapsible row */}
                    {/* <AnimatePresence>
                      {activeReview === pjt.projectId && (
                        <tr key={`review-${pjt.projectId}`}>
                          <td colSpan={5} className="bg-[#2a3b5a] px-4 py-4">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <h4 className="text-lg font-semibold mb-2">Submit Project</h4>
                              
                                <label for="code">Code Link: </label>
                              <input
                              type="url"
                                className="p-2 rounded bg-[#1e2a3a] text-white mb-3"
                                placeholder="Submit Code Link..."
                                id="code"
                                // value={reviewInputs[pjt.projectId]?.code || ''}
                                onChange={(e) =>
                                  handleReviewChange(pjt.projectId, 'code', e.target.value)
                                }
                              /><br/>
                              <label for="pdt">Product Link: </label>
                              <input
                              type="url"
                                className="p-2 rounded bg-[#1e2a3a] text-white mb-3"
                                placeholder="Submit Product Link..."
                                id="pdt"
                                // value={reviewInputs[pjt.projectId]?.review || ''}
                                onChange={(e) =>
                                  handleReviewChange(pjt.projectId, 'pdt', e.target.value)
                                }
                              />
                              
                              <br/><br/>
                              <Button
                                variant="green"
                                onClick={() =>
                                  submitReview(pjt.projectId, pjt.userId)
                                }
                              >
                                Submit Project
                              </Button>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {activestatus === pjt.projectId && (
                        <tr key={`review-${pjt.projectId}`}>
                          <td colSpan={5} className="bg-[#2a3b5a] px-4 py-4">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <h4 className="text-lg font-semibold mb-2">Edit status</h4>
                              
                                <label for="st">New Status(%): </label>
                              <input type="number" id="st" placeholder='Status' className="p-2 rounded bg-[#1e2a3a] text-white mb-3" min="0" max="1" step="0.01" 
                              	onChange={(e) =>
                                  handleReviewChange(pjt.projectId, 'status', e.target.value)
                                }/><br/>
                              
                              <Button
                                variant="green"
                                onClick={() =>
                                  updatestatus(pjt.projectId, pjt.userId)
                                }
                              >
                                Update Status
                              </Button>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence> */}
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
