import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import config from './config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Inisialisasi navigate
  const [token, setToken] = useState(null); // State untuk menyimpan token

  useEffect(() => {
    // Mengambil token dari localStorage saat komponen pertama kali dirender
    const savedToken = localStorage.getItem('token');

    if (savedToken) {
      // Jika token ditemukan, set token ke dalam state
      setToken(savedToken);
      console.log('Token ditemukan:', savedToken);

      // Misalnya, arahkan ke halaman /users jika token ada
      navigate('/users');
    } else {
      console.log('Token tidak ditemukan');
    }
  }, [navigate]);

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
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-body-tertiary">
      <form onSubmit={handleLogin}>
        <div className="text-center">
          <img src="/assets/logo.png" alt="Logo" width="100" height="100" />
        </div>

        <h1 className="h3 mb-3 fw-normal text-center">Masuk</h1>

        <div className="form-floating mb-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label htmlFor="floatingInput">Email</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label htmlFor="floatingPassword">Kata Sandi</label>
        </div>

        <div className="form-check text-start my-3">
          <input
            className="form-check-input"
            type="checkbox"
            value="remember-me"
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Ingat Saya
          </label>
        </div>
        <button className="btn btn-primary w-100 py-2" type="submit">
          Masuk
        </button>
        <p className="mt-5 text-body-secondary text-center">© 2017–2024</p>
      </form>
    </div>
  );
};

export default Login;
