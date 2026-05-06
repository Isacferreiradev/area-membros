import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import CertificateGenerator from './components/CertificateGenerator';
import { Download, ArrowLeft, ShieldCheck, CheckCircle2, ChevronRight, MessageCircle } from 'lucide-react';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  // LINKS OFICIAIS DO GOOGLE DRIVE
  const LINKS_DRIVE = {
    maps: "https://drive.google.com/drive/folders/1Kmd732P1tl2aBS-9RHDPM3Ew5YGtj4GO?usp=drive_link",
    audio: "https://drive.google.com/drive/folders/1H6k5bbhQzmqnsj26FJMXJ1mVfR3yCMUb?usp=drive_link",
    planner: "https://drive.google.com/drive/folders/1KfRVP0gpipWbKkluZC6KODaJlXWRS6wJ?usp=drive_link"
  };

  const moduleDetails = {
    maps: { 
      title: '300 Mapas Estruturados', 
      desc: 'O guia visual definitivo de Gênesis a Apocalipse.', 
      benefits: ['Gênesis a Apocalipse', 'Qualidade 4K', 'Mapas Luxo', 'Método Visual'], 
      driveLink: LINKS_DRIVE.maps, 
      image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=1200' 
    },
    audio: { 
      title: 'Audioguia VIP', 
      desc: 'Aprenda ouvindo com explicações profundas de cada mapa.', 
      benefits: ['Explicações Detalhadas', 'Alta Fidelidade', 'Estudo Mobile', 'Insight Teológico'], 
      driveLink: LINKS_DRIVE.audio,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200' 
    },
    planner: { 
      title: 'Planner 30 Dias', 
      desc: 'Seu cronograma estratégico para dominar a Bíblia.', 
      benefits: ['Metas Diárias', 'Checklist', 'Pronto para Impressão', 'Organização'], 
      driveLink: LINKS_DRIVE.planner,
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1200' 
    },
    certificate: { 
      title: 'Certificado Oficial', 
      desc: 'Reconheça sua dedicação e conclusão do estudo.', 
      benefits: ['Design Premium', 'Pronto para Moldura', 'Selo de Autenticidade', 'Honra Teológica'], 
      image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=1200' 
    }
  };

  return (
    <div className="app-container">
      <main className="main-content-v2">
        <div className="dashboard-wrapper">
          
          {activeModule !== 'dashboard' && (
            <header style={{ marginBottom: '30px' }}>
               <button onClick={() => setActiveModule('dashboard')} className="back-btn-responsive">
                 <ArrowLeft size={18} /> <span>VOLTAR PARA BIBLIOTECA</span>
               </button>
            </header>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={activeModule} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeModule === 'dashboard' ? (
                <Dashboard onSelectModule={setActiveModule} />
              ) : activeModule === 'certificate' ? (
                <CertificateGenerator onBack={() => setActiveModule('dashboard')} />
              ) : moduleDetails[activeModule] ? (
                <div className="detail-view-responsive">
                  <div className="hero-banner-v3 detail-hero" style={{ backgroundImage: `url('${moduleDetails[activeModule].image}')` }}>
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                      <h1 className="font-serif-lux main-title-responsive">{moduleDetails[activeModule].title}</h1>
                      <p className="desc-responsive">{moduleDetails[activeModule].desc}</p>
                    </div>
                  </div>

                  <div className="responsive-grid-detail">
                    <div className="main-detail-column">
                       <h3 className="font-serif-lux section-title-responsive">O que você recebe:</h3>
                       <div className="benefits-grid-responsive">
                         {moduleDetails[activeModule].benefits.map((b, i) => (
                           <div key={i} className="stat-card benefit-item">
                             <CheckCircle2 size={18} className="text-green" /> 
                             <span>{b}</span>
                           </div>
                         ))}
                       </div>
                       
                       <a href={moduleDetails[activeModule].driveLink} target="_blank" rel="noopener noreferrer" className="btn-premium full-width-mobile">
                         <Download size={20} /> ACESSAR MATERIAL NO DRIVE
                       </a>
                    </div>

                    <div className="sidebar-detail-column">
                       <div className="stat-card info-card">
                          <ShieldCheck size={28} className="text-gold" />
                          <div>
                            <h3 className="info-title">Acesso Vitalício</h3>
                            <p className="info-desc">Disponível para sempre.</p>
                          </div>
                       </div>
                       <div className="stat-card info-card">
                          <MessageCircle size={28} className="text-whatsapp" />
                          <div style={{ width: '100%' }}>
                            <h3 className="info-title">Suporte VIP</h3>
                            <a href="https://wa.me/5521969836161" target="_blank" className="whatsapp-link">WhatsApp Suporte <ChevronRight size={14} /></a>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        .back-btn-responsive { background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); color: white; padding: 12px 20px; border-radius: 15px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 0.8rem; }
        .responsive-grid-detail { display: grid; grid-template-columns: 1fr 350px; gap: 40px; }
        .benefits-grid-responsive { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 40px; }
        .benefit-item { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; padding: 15px; }
        .text-green { color: #22c55e; }
        .text-gold { color: var(--accent-gold); }
        .text-whatsapp { color: #25D366; }
        .info-card { display: flex; gap: 15px; align-items: center; padding: 20px; margin-bottom: 15px; }
        .info-title { font-size: 1rem; font-weight: 800; }
        .info-desc { font-size: 0.8rem; color: var(--text-secondary); }
        .whatsapp-link { color: #25D366; font-weight: 800; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 5px; margin-top: 5px; }
        
        @media (max-width: 1024px) {
          .responsive-grid-detail { grid-template-columns: 1fr; }
          .sidebar-detail-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        }

        @media (max-width: 768px) {
          .main-title-responsive { font-size: 2.2rem !important; }
          .desc-responsive { font-size: 1rem !important; }
          .section-title-responsive { font-size: 1.5rem !important; margin-bottom: 20px !important; }
          .benefits-grid-responsive { grid-template-columns: 1fr; }
          .sidebar-detail-column { grid-template-columns: 1fr; }
          .full-width-mobile { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}

export default App;
