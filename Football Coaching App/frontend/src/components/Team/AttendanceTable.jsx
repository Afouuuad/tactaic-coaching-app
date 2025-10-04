// ApplicantsTable.jsx
import React from 'react';

const ApplicantsTable = ({ applicants, onSelectApplicant }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Applicant</th>
          <th>Proposed Budget</th>
          <th>Proposed Deadline</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {applicants.map((app) => (
          <tr key={app._id}>
            {/* Adjust "applicantName" if your data uses a different property name */}
            <td>{app.applicantName}</td>
            <td>{app.proposedBudget}</td>
            <td>{new Date(app.proposedDeadline).toLocaleDateString()}</td>
            <td>
              <button onClick={() => onSelectApplicant(app)}>
                Accept
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApplicantsTable;
