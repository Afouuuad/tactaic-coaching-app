import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportsAnalytics = () => {
  const [stats, setStats] = useState({ userCount: 0, jobCount: 0, applicationCount: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/admin/reports', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Platform Statistics</h2>
      <p>Total Users: {stats.userCount}</p>
      <p>Total Jobs: {stats.jobCount}</p>
      <p>Total Applications: {stats.applicationCount}</p>
    </div>
  );
};

export default ReportsAnalytics;
