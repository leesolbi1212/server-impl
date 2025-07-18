// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BoardList    from './pages/BoardList';
import BoardDetail  from './pages/BoardDetail';
import PostForm     from './pages/PostForm';
import Header from './components/Header';
import UserProfile from './pages/UserProfile';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/"        element={<Navigate to="/login" replace />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/register"element={<RegisterPage />} />

        <Route
          path="/posts"
          element={
            <PrivateRoute>
              <BoardList />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts/new"
          element={
            <PrivateRoute>
              <PostForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <PrivateRoute>
              <BoardDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts/:id/edit"
          element={
            <PrivateRoute>
              <PostForm edit />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
