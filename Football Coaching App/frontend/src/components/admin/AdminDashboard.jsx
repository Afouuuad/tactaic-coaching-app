import React from 'react';
import AdminUsersTable from './AdminUsersTable';
import AdminJobsTable from './ModerateContentTable';
import ReportsAnalytics from './ReportsAnalytics';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ReportsAnalytics />
      <AdminUsersTable />
      <AdminJobsTable />
    </div>
  );
};

export default AdminDashboard;
