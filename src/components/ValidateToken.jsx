import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldAlert, CheckCircle2, User, Lock, ArrowRight } from 'lucide-react';

const ValidateToken = ({ token, onValid, onInvalid }) => {
  const [status, setStatus] = useState('validating'); // validating, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    senha: '',
    confirmarSenha: ''
  });

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || ''; 
        const response = await fetch(`${apiUrl}/api/validate-token?token=${token}`);
        const data = await response.json();

        if (data.valid) {
          setUserEmail(data.email);
          setStatus('success');
        } else {
          setStatus('error');
          if (data.error === 'Token já utilizado') {
            setErrorMessage('Token já utilizado');
          } else {
            setErrorMessage(data.error || 'Link inválido ou expirado.');
          }
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
        setStatus('error');
        setErrorMessage('Erro de conexão com o servidor.');
      }
    };

    if (token) {
      validateAccess();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          nome: formData.nome,
          senha: formData.senha,
          email: userEmail
        })
      });

      const data = await response.json();

      if (response.ok) {
        onValid({ name: formData.nome, email: userEmail });
      } else {
        alert(data.error || "Erro ao realizar cadastro.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro de conexão ao realizar cadastro.");
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#F8FAFC',
      padding: '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ 
          maxWidth: '420px', 
          width: '100%', 
          padding: '40px 30px', 
          textAlign: 'center',
          background: 'white'
        }}
      >
        {status === 'validating' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ color: 'var(--primary-green)' }}
            >
              <Loader2 size={48} />
            </motion.div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>
              Validando seu acesso...
            </h2>
          </div>
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'var(--pastel-green)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--primary-green)',
                margin: '0 auto 20px'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                Finalizar Cadastro
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Olá! Defina seus dados de acesso para <strong>{userEmail}</strong>.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Nome Completo</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    required
                    type="text"
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Criar Senha</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={(e) => setFormData({...formData, senha: e.target.value})}
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)' }}>Confirmar Senha</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmarSenha}
                    onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="btn-primary" 
                style={{ width: '100%', marginTop: '10px', height: '56px', fontSize: '1rem' }}
              >
                Concluir e Entrar <ArrowRight size={20} />
              </button>
            </form>
          </div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
              <ShieldAlert size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)' }}>
              Acesso Negado
            </h2>
            <div style={{ 
              color: '#EF4444', 
              fontSize: '0.9rem', 
              fontWeight: '600', 
              padding: '16px', 
              background: '#FEF2F2', 
              borderRadius: '12px', 
              width: '100%',
              border: '1px solid #FCA5A5'
            }}>
              {errorMessage === 'Token já utilizado' ? 'ESTE LINK JÁ FOI UTILIZADO PARA REALIZAR O CADASTRO.' : errorMessage}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Se você já concluiu seu cadastro, utilize seu email para entrar na tela de login.
            </p>
            <button 
              onClick={onInvalid}
              className="btn-primary" 
              style={{ width: '100%', marginTop: '10px' }}
            >
              Fazer Login Manual <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ValidateToken;
