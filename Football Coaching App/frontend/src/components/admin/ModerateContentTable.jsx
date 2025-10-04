import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminJobsTable = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/jobs', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setJobs(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Potentially: admin can cancel or remove a job
  const handleCancelJob = (jobId) => {
    // e.g. put or patch job to 'cancelled'
  };

  return (
    <div>
      <h2>All Jobs</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th><th>Posted By</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j._id}>
              <td>{j.title}</td>
              <td>{j.postedBy?.firstName} {j.postedBy?.surname}</td>
              <td>{j.status}</td>
              <td>
                <button onClick={() => handleCancelJob(j._id)}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminJobsTable;
