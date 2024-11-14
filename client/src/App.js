import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard'; // Halaman dashboard setelah login
import Users from './Users';
import Hpl from './Hpl';
import BeratBadan from './BeratBadan';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path='/hpl'element={<Hpl />} />
        <Route path='/berat_badan'element={<BeratBadan />} />
      </Routes>
    </Router>
  );
}

export default App;
