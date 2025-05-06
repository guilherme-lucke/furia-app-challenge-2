
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type AuthFormProps = {
  initialMode?: 'login' | 'signup';
};

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'login') {
        await login(email, password);
        toast.success('Login realizado com sucesso!');
      } else {
        await signup(email, password, lgpdConsent);
        toast.success('Conta criada com sucesso!');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro durante autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 relative">
          <img 
            src="/lovable-uploads/9dfa9f38-5065-47a2-afb0-2d5d884c4dbc.png" 
            alt="FURIA Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === 'login' ? 'Entrar' : 'Criar Conta'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="furia-input w-full"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="furia-input w-full"
            required
          />
        </div>
        
        {mode === 'signup' && (
          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="lgpd"
                type="checkbox"
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="w-4 h-4 accent-furia-gold"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="lgpd" className="text-gray-300">
                Concordo com o processamento dos meus dados de acordo com a {' '}
                <a href="#" className="text-furia-gold underline">
                  Lei Geral de Proteção de Dados (LGPD)
                </a>
                .
              </label>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className="furia-button w-full"
          disabled={loading}
        >
          {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="text-furia-gold hover:underline"
        >
          {mode === 'login'
            ? 'Não tem uma conta? Cadastre-se'
            : 'Já tem uma conta? Entrar'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
