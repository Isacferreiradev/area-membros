import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Puzzle } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.user) {
        onLogin(data.user);
      } else {
        setError(data.error || "Acesso Negado: Dados incorretos.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError("Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, var(--pastel-blue) 0%, var(--pastel-pink) 100%)'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--pastel-yellow)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--primary-green)'
          }}>
            <Puzzle size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px' }}>
            Área de Membros
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Acesse seu material exclusivo
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-dark)' }}>E-mail</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-dark)' }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                background: '#FEF2F2', 
                color: '#EF4444', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '0.8rem', 
                fontWeight: '600',
                textAlign: 'center',
                border: '1px solid #FECACA'
              }}
            >
              {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading}
            style={{ marginTop: '12px', width: '100%', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Verificando...' : 'Entrar Agora'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Precisa de ajuda? <a href="#" style={{ color: 'var(--primary-green)', fontWeight: '600', textDecoration: 'none' }}>Fale conosco</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
