
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-furia-black border-t border-furia-gold/20 p-2">
      <div className="flex justify-around items-center">
        <NavButton 
          icon={<Home size={20} />} 
          label="Home" 
          isActive={isActive('/home')} 
          onClick={() => navigate('/home')} 
        />
        <NavButton 
          icon={<LayoutDashboard size={20} />} 
          label="Dash" 
          isActive={isActive('/dash')} 
          onClick={() => navigate('/dash')} 
        />
        <NavButton 
          icon={<User size={20} />} 
          label="Perfil" 
          isActive={isActive('/profile')} 
          onClick={() => navigate('/profile')} 
        />
        <NavButton 
          icon={<LogOut size={20} />} 
          label="Sair" 
          isActive={false} 
          onClick={handleLogout} 
        />
      </div>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-1 px-4 rounded-md transition-colors ${
        isActive 
          ? 'text-furia-gold' 
          : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
      {isActive && <div className="w-1.5 h-1.5 bg-furia-gold rounded-full mt-1" />}
    </button>
  );
};

export default Navigation;
