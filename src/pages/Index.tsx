
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';
import Navigation from '@/components/Navigation';
import ProfileForm from '@/components/ProfileForm';
import Dashboard from '@/components/Dashboard';
import ProfileView from '@/components/ProfileView';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Home screen
const Home: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6">
      <div className="relative w-32 h-32 mb-8">
        <img 
          src="/lovable-uploads/9dfa9f38-5065-47a2-afb0-2d5d884c4dbc.png" 
          alt="FURIA Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Bem-vindo ao FURIA Fan First</h1>
      <p className="text-furia-gold mb-6">Construa sua jornada como fã da FURIA</p>
      
      <div className="text-center text-gray-300 max-w-sm mb-8">
        <p>
          Compartilhe suas preferências, acompanhe seus jogadores favoritos e faça parte da comunidade FURIA.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <button 
          onClick={() => window.location.href = '/profile'} 
          className="furia-button"
        >
          Editar Perfil
        </button>
        <button 
          onClick={() => window.location.href = '/dash'} 
          className="px-5 py-2.5 rounded bg-furia-black border border-furia-gold text-furia-gold font-bold transition-all hover:bg-furia-gold/10"
        >
          Ver Dashboard
        </button>
      </div>
    </div>
  );
};

// App wrapper
const AppWrapper: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-furia-black text-white">
      <div className="relative min-h-screen">
        <div className="fixed inset-0 panther-bg pointer-events-none" />
        
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/home" /> : <AuthForm />
            } />
            
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfileForm />
              </ProtectedRoute>
            } />
            
            <Route path="/dash" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile-data" element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          {isAuthenticated && <Navigation />}
        </div>
      </div>
    </div>
  );
};

// Main component
const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
};

export default Index;
