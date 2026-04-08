import { useState, useEffect } from 'react';
import AdminNavBar from './AdminNavBar';
import { getAllUsers, deleteUser } from '../api/admin';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import './AdminTheme.css';

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchName.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchName.toLowerCase()) ||
        user.id.toString().includes(searchName)
      );
      setFilteredUsers(filtered);
    }
  }, [searchName, users]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? Note: Users with certificates cannot be deleted.')) {
      try {
        const response = await deleteUser(id);
        toast.success(response);
        fetchUsers();
      } catch (error) {
        if (error.response?.status === 500) {
          toast.error('Cannot delete user: This user has certificates. Please delete all certificates first.');
        } else {
          toast.error(error.response?.data || error.message || 'Error deleting user');
        }
      }
    }
  };

  return (
    <div className="admin-page">
      <AdminNavBar />
      <div className="admin-shell">
        <h1 className="admin-title">All Users</h1>
        <p className="admin-section-note">
          Review registered accounts, search by name or ID, and keep the user list organized.
        </p>
        
        {/* Search Box */}
        <div className="admin-search-wrap">
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="admin-search"
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="admin-table-wrap">
            <div className="admin-table-meta">
              <span className="admin-table-chip">{filteredUsers.length} records</span>
              <span className="admin-table-chip admin-table-chip-soft">Managed users</span>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Contact</th>
                  <th>Registered At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admin-empty">
                      {searchName ? 'No users found matching your search' : 'No users found'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.gender}</td>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>{user.Contact}</td>
                      <td>{user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button onClick={() => handleDelete(user.id)} className="admin-btn-danger">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllUsers;
