import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Role_selection from './components/Role_selection';
import Login from './components/Login';
import Dashboard from './components/dashboard/Dashboard';
import Register from './components/Register';

import Admin from './components/Admin/Admin';
import Student from './components/Student/Student';
import Warden from './components/Warden/Warden';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Role_selection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
       
        <Route path="/admin/dashboard" element={<Admin />} />
        <Route path="/warden/dashboard" element={<Warden/>} />
        <Route path="/student/dashboard" element={<Student />} />
      </Routes>
    </Router>
  );
}

export default App;
