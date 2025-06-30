import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { useNavigate ,Link} from 'react-router-dom';
import Button from '../components/Button';
import Loader from '../components/loader';


export default function Status() {
  const [applications, setApplications] = useState([]);
  const [projects,setproject]=useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const testing = false;


  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        if (testing) {
        
        } else {
          const userRes = await axios.get(
          `${import.meta.env.VITE_BACKENDURL}/current-user`,
          { withCredentials: true }
        );
        const userid = userRes.data.data._id;
          const res = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/userappliedprojects`,{userid},{withCredentials: true}
        );
            let filtered = res.data.data.filter((p) => p.completed==false);
            setApplications(filtered);
            console.log(filtered);
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const removeapply = async (projectid) => {   
    const confirmed = window.confirm("Remove Apply?");
    if (!confirmed) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/removeapply`,
        {projectid},
        { withCredentials: true }
      );
      navigate(0);
      alert("Apply removed");
    } catch (err) {
      console.error('Failed to accept user:', err);
      alert('Could not accept user.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="secondary"
          onClick={() => navigate(-1)}
        //   className="mb-4 text-sm text-teal-300 hover:underline"
        >
          ← Back
        </Button>

        <h2 className="text-3xl font-bold mb-6">User Applications</h2>

        {loading ? (
          <p>Loading applications...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-[#1f2a41]">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 border-b border-gray-600">
                <tr>
                  {/* <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Specialties</th>
                  <th className="py-3 px-4">Avg. Rating</th>
                  <th className="py-3 px-4">Action</th> */}
                  {/* <th className="py-3 px-4">Username</th> */}
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Status</th>
                  {/* <th className="py-3 px-4">Avg. Rating</th> */}
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((apps) =>
                        // return application.map((app)=>(
                  <tr className="border-b border-gray-700 hover:bg-gray-800/40">
                    {/* <td className="py-3 px-4 hover:underline cursor-pointer"><Link to={`/profile?userid=${app?._id}`}>{app?.username || 'N/A'}</Link></td> */}
                    <td className="py-3 px-4">{apps?.pjt_name || 'Untitled'}</td>
                    <td className="py-3 px-4">
                      {apps.accepted ? (
  apps.acceptedId !== userid
    ? <div>Rejected</div>
    : <div>Accepted</div>
) : (
  <div>Applied</div>
  )}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="danger"
                        onClick={() =>
                          acceptUser(apps?.projectId)
                        }
                        // className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Remove Apply
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p>No More Applications</p>
          </div>
          
        )}
      </div>
    </div>
  );
}
