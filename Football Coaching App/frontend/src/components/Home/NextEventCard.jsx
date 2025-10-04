// LatestJobCards.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LatestJobCards = ({ jobs }) => {
  return (
    <div className="job-cards">
      {jobs.slice(0, 6).map((job) => (
        <div key={job._id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.description.substring(0, 100)}...</p>
          <Link to={`/jobs/${job._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default LatestJobCards;
