// AppliedJobTable.jsx
import React from 'react';

const AppliedJobTable = ({ applications }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Job Title</th>
          <th>Status</th>
          <th>Budget</th>
          <th>Deadline</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => (
          <tr key={app._id}>
            {/* Adjust property names (e.g., jobTitle) to match your data model */}
            <td>{app.jobTitle}</td>
            <td>{app.status}</td>
            <td>{app.proposedBudget}</td>
            <td>{new Date(app.proposedDeadline).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AppliedJobTable;
