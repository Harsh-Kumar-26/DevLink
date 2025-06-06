import { useState, useEffect } from "react";
import axios from "axios";

function useProject(pjtid) {
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pjtid) return;

    async function fetchProject() {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/send-project`,
          pjtid,
          { withCredentials: true }
        );
        setProject(response.data.data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to fetch project");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [pjtid]);

  return { isLoading, project, error };
}
