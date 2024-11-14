import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';

const Dashboard = () => {
  // State to store the list of users
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem('token');
      
      // Jika token tidak ada, beri peringatan atau lakukan tindakan lain
      if (!token) {
        console.log('No token found');
        return;
      }
  
      // Kirim permintaan GET dengan token dalam header Authorization
      const { data } = await axios.get(config.url + '/api/mobile_users', {
        headers: {
          Authorization: `Bearer ${token}`, // Menyertakan token dalam header
        }
      });
  
      // Update state users dengan data yang diterima
      setUsers(data);
  
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };
  

  // Option 1: Fetch users when the component mounts
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>{localStorage.getItem('token')}</p>
      
      {/* Option 2: Button to fetch users manually */}
      <button onClick={getUsers}>Get Users</button>

      {/* Display users as a list */}
      <h3>User List</h3>
      <ul>
        {users.length > 0 ? (
          users.map((user, index) => (
            <li key={index}>{user.email}</li> // Or display other user info, e.g., user.name
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
