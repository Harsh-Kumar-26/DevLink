import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import Loader from "./loader"; // Your loader component
import ProjectCardt from "./Projectcardt"; // Your card component
import Button from "./Button";

export default function UserProjectsList({pjtkey="all"}) {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5; // number of projects per fetch

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const user=await axios.get(`${import.meta.env.VITE_BACKENDURL}/current-user`,{ withCredentials: true });
        const userid=user.data.data._id;
        const response = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/usercreatedprojects`,{userid},{withCredentials: true}
        );
        console.log("Res "+response);
        const data = response.data.data;
        if (data.length < limit) {
          setHasMore(false);
        }
        let filtered = [];
      if (pjtkey === "all") {
        filtered = data;
      } else if (pjtkey === "accepted") {
        filtered = data.filter((p) => (p.accepted==true && p.completed==false));
      } else if (pjtkey === "completed") {
        filtered = data.filter((p) => p.completed==true);
      }
      setProjects((prev) => [...prev, ...filtered]);
      console.log("Pro "+projects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) setPage((p) => p + 1);
  };

  return (
    <>
  <div className="projects-list flex-col flex-wrap justify-center gap-6 px-4">
    {projects.map((project) => (
      <ProjectCardt pjtid={project.projectId} />
    ))}
  </div>

  {loading && (
    <div className="flex justify-center mt-6" role="status">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348..."
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )}

  {!loading && hasMore && (
    <div className="flex justify-center mt-6">
      <Button onClick={loadMore} variant="green">
        Load More
      </Button>
    </div>
  )}

  {!hasMore && (
    <p className="mt-6 text-center text-gray-400">No more projects</p>
  )}
</>
  );
}
