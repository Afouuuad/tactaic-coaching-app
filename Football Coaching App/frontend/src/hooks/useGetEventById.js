import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetJobById = (jobId) => {
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) return;
    axios.get(`/api/jobs/${jobId}`)
      .then(res => setJob(res.data))
      .catch(err => setError(err));
  }, [jobId]);

  return { job, error };
};

export default useGetJobById;
