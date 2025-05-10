
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-restaurant-700">Loading...</h1>
      </div>
    </div>
  );
};

export default Index;
