import React, { useState, useRef, useCallback } from 'react';
import * as htmlToImage from 'html-to-image';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Award, CheckCircle2, ShieldCheck } from 'lucide-react';

// --- COMPONENTE BASE DO CERTIFICADO ---
function CertificateBase({ studentName, dateStr, theme }) {
  const W = 1000, H = 700;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block", background: "#fcfaf2" }}>
      <defs>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
          .font-sans { font-family: 'Montserrat', sans-serif; }
          .font-serif { font-family: 'Playfair Display', serif; }
        `}</style>
        
        <filter id="paperTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#fcfaf2" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
        </filter>

        <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#F5E08E" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="#fcfaf2" />
      <rect width={W} height={H} fill="white" opacity="0.4" filter="url(#paperTexture)" />

      <rect x="30" y="30" width={W-60} height={H-60} fill="none" stroke="url(#goldGradient)" strokeWidth="4" />
      <rect x="45" y="45" width={W-90} height={H-90} fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />

      <g fill="url(#goldGradient)">
        <path d="M 30,30 L 100,30 L 100,35 L 35,35 L 35,100 L 30,100 Z" />
        <path d="M 970,30 L 900,30 L 900,35 L 965,35 L 965,100 L 970,100 Z" />
        <path d="M 30,670 L 100,670 L 100,665 L 35,665 L 35,600 L 30,600 Z" />
        <path d="M 970,670 L 900,670 L 900,665 L 965,665 L 965,600 L 970,600 Z" />
      </g>

      <text x={W/2} y={140} textAnchor="middle" className="font-sans" fontSize="14" fontWeight="800" fill="#888" letterSpacing="5">CERTIFICADO DE MÉRITO TEOLÓGICO</text>
      <text x={W/2} y={200} textAnchor="middle" className="font-serif" fontSize="56" fontWeight="900" fill="#1a1a1a" letterSpacing="2">Raiz Bíblica</text>
      <line x1={W/2-100} y1={220} x2={W/2+100} y2={220} stroke="#D4AF37" strokeWidth="2" />

      <text x={W/2} y={280} textAnchor="middle" className="font-sans" fontSize="18" fill="#444">Certificamos com honra que</text>
      
      <text x={W/2} y={380} textAnchor="middle" className="font-serif" fontSize="64" fontStyle="italic" fontWeight="700" fill="#D4AF37">
        {studentName || "[Nome do Aluno]"}
      </text>
      <line x1={W/2-250} y1={395} x2={W/2+250} y2={395} stroke="#D4AF37" strokeWidth="1" opacity="0.3" />

      <text x={W/2} y={450} textAnchor="middle" className="font-sans" fontSize="16" fill="#444">
        Concluiu com êxito o programa de estudos estruturados dos
      </text>
      <text x={W/2} y={490} textAnchor="middle" className="font-sans" fontSize="24" fontWeight="900" fill="#1a1a1a">
        +300 MAPAS VISUAIS DA BÍBLIA
      </text>

      <g transform={`translate(${W/2}, 590)`}>
         <circle r="55" fill="url(#goldGradient)" />
         <circle r="48" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
         <path d="M -15,-15 L 15,15 M -15,15 L 15,-15" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
         <text textAnchor="middle" y="5" className="font-sans" fontSize="10" fontWeight="900" fill="#854D0E">OFICIAL</text>
      </g>

      <g transform="translate(150, 620)">
        <line x1="0" y1="0" x2="200" y2="0" stroke="#1a1a1a" strokeWidth="1" />
        <text x="100" y="20" textAnchor="middle" className="font-sans" fontSize="10" fontWeight="700">COORDENAÇÃO RAIZ BÍBLICA</text>
      </g>

      <g transform={`translate(${W-350}, 620)`}>
        <line x1="0" y1="0" x2="200" y2="0" stroke="#1a1a1a" strokeWidth="1" />
        <text x="100" y="20" textAnchor="middle" className="font-sans" fontSize="10" fontWeight="700">DATA DE EMISSÃO</text>
        <text x="100" y="40" textAnchor="middle" className="font-sans" fontSize="12" fontWeight="900" fill="#1a1a1a">{dateStr}</text>
      </g>
    </svg>
  );
}

const CertificateGenerator = ({ onBack }) => {
  const [studentName, setStudentName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const certificateRef = useRef(null);
  const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const handleDownload = useCallback(async () => {
    if (!studentName.trim()) return;
    setIsDownloading(true);
    
    try {
      await document.fonts.ready;
      const dataUrl = await htmlToImage.toPng(certificateRef.current, {
        quality: 1.0,
        pixelRatio: 3, 
        backgroundColor: '#fcfaf2'
      });
      
      const link = document.createElement('a');
      link.download = `Certificado-Raiz-Biblica-${studentName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      
      setIsDownloading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error('Erro:', err);
      setIsDownloading(false);
    }
  }, [studentName]);

  return (
    <div className="cert-container-responsive">
      <div className="cert-layout-responsive">
        
        {/* Lado Esquerdo / Topo Mobile: Preview */}
        <div className="cert-preview-column">
           <div className="cert-header-sm">
              <h2 className="font-serif-lux">Sua Prévia</h2>
              <span className="badge-4k">ALTA QUALIDADE</span>
           </div>
           <div ref={certificateRef} className="cert-canvas-box">
              <CertificateBase studentName={studentName} dateStr={today} />
           </div>
           <p className="cert-hint-mobile">* Visualize no computador para uma prévia maior.</p>
        </div>

        {/* Lado Direito / Base Mobile: Formulário */}
        <div className="stat-card cert-form-responsive">
           <Award className="icon-gold" size={40} />
           <h2 className="font-serif-lux title-lg">Gere seu Certificado</h2>
           <p className="text-secondary-responsive">Insira seu nome completo para concluir sua honra teológica.</p>

           <div className="form-group-responsive">
              <label className="label-responsive">NOME DO FORMANDO</label>
              <input 
                type="text" 
                placeholder="Seu nome completo" 
                value={studentName} 
                onChange={(e) => setStudentName(e.target.value)}
                className="input-responsive"
              />
           </div>

           <button 
             className="btn-premium btn-full-mobile" 
             onClick={handleDownload}
             disabled={isDownloading || !studentName.trim()}
           >
             {isDownloading ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
             {isDownloading ? 'GERANDO...' : 'BAIXAR CERTIFICADO'}
           </button>

           {showSuccess && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="success-badge-responsive">
                <CheckCircle2 size={18} />
                <span>Download concluído!</span>
             </motion.div>
           )}

           <div className="info-box-responsive">
              <ShieldCheck size={20} className="icon-gold" />
              <div>
                 <p className="info-box-title">Documento Oficial</p>
                 <p className="info-box-desc">Reconhecimento do método Raiz Bíblica.</p>
              </div>
           </div>
        </div>

      </div>

      <style>{`
        .cert-container-responsive { maxWidth: 1200px; margin: 0 auto; padding-bottom: 80px; }
        .cert-layout-responsive { display: grid; grid-template-columns: 1fr 380px; gap: 50px; align-items: start; }
        .badge-4k { font-size: 0.7rem; color: var(--text-secondary); background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border-glass); }
        .cert-canvas-box { width: 100%; border-radius: 15px; overflow: hidden; boxShadow: 0 30px 60px rgba(0,0,0,0.5); border: 1px solid var(--border-glass); }
        .icon-gold { color: var(--accent-gold); margin-bottom: 20px; }
        .cert-header-sm { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .title-lg { font-size: 1.8rem; margin-bottom: 10px; }
        .text-secondary-responsive { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 30px; }
        .label-responsive { font-size: 0.75rem; fontWeight: 900; color: var(--accent-gold); letterSpacing: 2px; display: block; margin-bottom: 12px; }
        .input-responsive { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); padding: 18px; border-radius: 12px; color: white; font-size: 1.1rem; outline: none; }
        .form-group-responsive { margin-bottom: 30px; }
        .btn-full-mobile { width: 100%; justify-content: center; }
        .success-badge-responsive { margin-top: 20px; padding: 15px; background: rgba(34, 197, 94, 0.1); border-radius: 12px; border: 1px solid #22c55e; display: flex; align-items: center; gap: 10px; color: #22c55e; font-weight: 700; font-size: 0.85rem; }
        .info-box-responsive { margin-top: 40px; padding: 20px; background: rgba(212, 175, 55, 0.03); border-radius: 15px; border: 1px solid var(--accent-gold-soft); display: flex; gap: 12px; }
        .info-box-title { font-size: 0.85rem; font-weight: 800; }
        .info-box-desc { font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px; }
        .cert-hint-mobile { display: none; }

        @media (max-width: 1024px) {
          .cert-layout-responsive { grid-template-columns: 1fr; }
          .cert-preview-column { order: 2; margin-top: 40px; }
          .cert-form-responsive { order: 1; }
          .cert-hint-mobile { display: block; text-align: center; font-size: 0.7rem; color: var(--text-secondary); margin-top: 15px; font-style: italic; }
        }

        @media (max-width: 768px) {
           .title-lg { font-size: 1.5rem; }
           .input-responsive { padding: 15px; font-size: 1rem; }
           .cert-container-responsive { padding: 0 5px; }
        }
      `}</style>
    </div>
  );
};

export default CertificateGenerator;
