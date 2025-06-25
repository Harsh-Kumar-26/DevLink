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

export default function ClientProjectReviews() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReview, setActiveReview] = useState(null);
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
            filtered = res.data.data.filter((p) => p.completed==true);
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

  const handleReviewChange = (projectId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value,
      },
    }));
  };

  const submitReview = async (projectId, userId) => {
    const reviewData = reviewInputs[projectId] || {};
    if (!reviewData.review || reviewData.rating == null) {
      alert("Please provide both a review and a rating.");
      return;
    }

    try {
      if (!testing) {
        console.log(projectId);
        
        await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/review`,
          {
            projectid:projectId,
            review: reviewData.review,
            rating: reviewData.rating,
          },
          { withCredentials: true }
        );
      } else {
        console.log('Mock submit:', { projectId, userId, ...reviewData });
      }
      alert('Review submitted!');
      setActiveReview(null);
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Could not submit review.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>

        <h2 className="text-3xl font-bold mb-6">Review & Payments</h2>

        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-[#1f2a41]">
            <table className="w-full text-sm text-left border-separate border-spacing-0">
              <thead className="text-gray-400 border-b border-gray-600">
                <tr>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Code Link</th>
                  <th className="py-3 px-4">Product Link</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((pjt) => (
                  <>
                    <tr
                      key={pjt.projectId}
                      className="border-b border-gray-700 hover:bg-gray-800/40"
                    >
                      <td className="py-3 px-4">{pjt.pjt_name}</td>
                      <td className="py-3 px-4">
                        <Link to={`/profile?userid=${pjt.accept._id}`} className="hover:underline">
                          {pjt.accept.username}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={pjt.code_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline cursor-pointer"
                        >
                          Code
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={pjt.pdt_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-400 hover:underline cursor-pointer"
                        >
                          Product
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 flex-wrap">
                          {pjt.reviewed?(<Button
                            variant="secondary"
                            onClick={() =>
                              setActiveReview(activeReview === pjt.projectId ? null : pjt.projectId)
                            }
                          >
                            Edit Review
                          </Button>):(<Button
                            variant="primary"
                            onClick={() =>
                              setActiveReview(activeReview === pjt.projectId ? null : pjt.projectId)
                            }
                          >
                            Review Project
                          </Button>)}
                          {pjt.paid?(<div className="mt-3 text-green-400 text-sm">✅Paid</div>):(<Button variant="green" onClick={() => alert('Payment flow placeholder')}>
                            Payment
                          </Button>)}
                        </div>
                      </td>
                    </tr>

                    {/* Review section as collapsible row */}
                    <AnimatePresence>
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
                              {pjt.reviewed?(<h4 className="text-lg font-semibold mb-2">Edit Review</h4>):(<h4 className="text-lg font-semibold mb-2">Submit Review</h4>)}
                              <textarea
                                className="w-full p-2 rounded bg-[#1e2a3a] text-white mb-3"
                                rows="4"
                                placeholder="Write your review..."
                                value={reviewInputs[pjt.projectId]?.review || ''}
                                onChange={(e) =>
                                  handleReviewChange(pjt.projectId, 'review', e.target.value)
                                }
                              />
                              <div className="flex items-center gap-2 mb-4">
                                <span>Rating:</span>
                                {[0, 1, 2, 3, 4, 5].map((num) => (
                                  <FaStar
                                    key={num}
                                    className={`cursor-pointer ${
                                      (reviewInputs[pjt.projectId]?.rating || 0) >= num
                                        ? 'text-yellow-400'
                                        : 'text-gray-500'
                                    }`}
                                    onClick={() =>
                                      handleReviewChange(pjt.projectId, 'rating', num)
                                    }
                                  />
                                ))}
                                <span>{reviewInputs[pjt.projectId]?.rating ?? 0}/5</span>
                              </div>
                              <Button
                                variant="green"
                                onClick={() =>
                                  submitReview(pjt.projectId, pjt.userId)
                                }
                              >
                                Submit Review
                              </Button>
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
