import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Function to check if the token has expired
const checkTokenExpiration = () => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  if (!token) {
    // If no token is found, return false (user is not authenticated)
    return false;
  }

  try {
    // Decode token to access expiration time
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000; // exp is in seconds, convert it to milliseconds

    // Check if the token has expired
    if (expirationTime < Date.now()) {
      return false; // Token has expired
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return false; // Return false if there's an error decoding the token
  }

  return true; // Token is still valid
};

// Custom hook to handle authentication state and token expiration check
const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = checkTokenExpiration();

    if (!isAuthenticated) {
      // If token has expired, log out and redirect to login page
      localStorage.removeItem('token');
      navigate('/login'); // Redirect to the login page
    }
  }, [navigate]); // Trigger re-run of the effect when navigate changes
};

export default useAuth;
