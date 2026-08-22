import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import BrowseJobs from '../pages/BrowseJobs/BrowseJobs';
import JobDetails from '../pages/JobDetails/JobDetails';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import PostJob from '../pages/PostJob/PostJob';
import EmployerDashboard from '../pages/Dashboard/EmployerDashboard';
import JobSeekerDashboard from '../pages/Dashboard/JobSeekerDashboard';
import AdminDashboard from '../pages/Dashboard/AdminDashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';
import NotFound from '../pages/NotFound/NotFound';
import '../App.css';

function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Role-Based Protected Routes */}
        <Route
          path="/employer"
          element={
            <ProtectedRoute allowedRoles={['employer', 'admin']}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute allowedRoles={['employer', 'admin']}>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobseeker"
          element={
            <ProtectedRoute allowedRoles={['job-seeker', 'admin']}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={['job-seeker', 'admin']}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default AppRoutes;
