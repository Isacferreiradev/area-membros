import React from 'react';
import { motion } from 'framer-motion';
import { Play, ShieldCheck, Zap, BookOpen, Clock, ArrowRight } from 'lucide-react';

const Dashboard = ({ onSelectModule }) => {
  const allMaterials = [
    { id: 'maps', title: '300 Mapas Bíblicos', desc: 'Acervo Completo 4K.', image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800' },
    { id: 'audio', title: 'Audioguia VIP', desc: 'Explicações Imersivas.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800' },
    { id: 'planner', title: 'Planner 30 Dias', desc: 'Metodologia de Estudo.', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800' },
    { id: 'certificate', title: 'Certificado', desc: 'Reconhecimento Oficial.', image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800' }
  ];

  const stats = [
    { label: 'Mapas Disponíveis', value: '300+', icon: <BookOpen size={20} /> },
    { label: 'Seu Acesso', value: 'Vitalício', icon: <ShieldCheck size={20} /> },
    { label: 'Membro VIP', value: 'Ativo', icon: <Zap size={20} /> },
    { label: 'Suporte Aluno', value: '24h', icon: <Clock size={20} /> }
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ marginBottom: '35px' }}>
         <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '4px', marginBottom: '10px' }}>BIBLIOTECA RAIZ BÍBLICA</p>
         <h1 className="font-serif-lux" style={{ fontSize: '2.5rem' }}>Bem-vindo, Membro <span style={{ color: 'var(--accent-gold)' }}>VIP</span></h1>
         <p style={{ color: 'var(--text-secondary)', marginTop: '5px', fontSize: '1rem' }}>Escolha um material abaixo para iniciar seu estudo.</p>
      </div>

      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-banner-v3"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1438263301115-f01e87d19963?auto=format&fit=crop&q=80&w=2000')` }}
        onClick={() => onSelectModule('maps')}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--accent-gold)', letterSpacing: '4px', marginBottom: '15px', display: 'block' }}>RECOMENDADO PARA HOJE</span>
          <h2 className="font-serif-lux" style={{ fontSize: '3rem', marginBottom: '25px', lineHeight: '1.1' }}>Os +300 Mapas <br/> <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Visuais Estruturados</span></h2>
          <button className="btn-premium">
            <Play size={20} fill="currentColor" /> ACESSAR AGORA
          </button>
        </div>
      </motion.div>

      {/* Sua Biblioteca (Larger Cards + Instruction) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '25px' }}>
         <h2 className="font-serif-lux" style={{ fontSize: '1.8rem' }}>Sua Biblioteca</h2>
         <div className="scroll-hint">
            Deslize para ver os materiais <ArrowRight size={14} />
         </div>
      </div>
      
      <div className="poster-grid">
        {allMaterials.map((item) => (
          <div key={item.id} className="poster-card-v3" style={{ backgroundImage: `url(${item.image})` }} onClick={() => onSelectModule(item.id)}>
            <div className="overlay-v3">
              <h3 className="font-serif-lux" style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bento Stats */}
      <div className="stats-grid">
         {stats.map((s, i) => (
           <div key={i} className="stat-card">
              <div style={{ color: 'var(--accent-gold)', marginBottom: '12px' }}>{s.icon}</div>
              <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
              <p style={{ fontSize: '1.2rem', fontWeight: '900' }}>{s.value}</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Dashboard;
