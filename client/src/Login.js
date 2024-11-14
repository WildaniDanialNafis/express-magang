import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import config from './config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Inisialisasi navigate

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(config.url + '/api/login', {
        email,
        password,
      });
    
      // Log seluruh respons dari server untuk memastikan token ada di dalamnya
      console.log('Login Response:', response);
    
      // Jika token ada, simpan di localStorage dan log token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      } else {
        console.log('No token found in response');
      }
    
      setMessage('Login successful!');
      navigate('/users'); // Redirect setelah login berhasil
    } catch (error) {
      console.error('Login Error:', error); // Log error jika terjadi
      setMessage('Invalid credentials');
    }    
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
