import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSuspend = (id, suspended) => {
    const token = localStorage.getItem('token');
    axios.put(`/api/admin/users/${id}`, { isSuspended: suspended }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isSuspended: suspended } : u));
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Suspended</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.firstName} {u.surname}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isSuspended ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleSuspend(u._id, !u.isSuspended)}>
                  {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                </button>
                <button onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersTable;
