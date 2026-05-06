import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, Award, CheckCircle2, RefreshCw } from 'lucide-react';
import certificateTemplate from './assets/template.png';

// Standalone Certificate Generator Component
const CertificateApp = () => {
  const [childName, setChildName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const certificateRef = useRef(null);
  
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const educatorName = "Dra. Marinalva Santana";

  const handleDownload = async () => {
    if (!childName) {
      alert('Por favor, insira o nome da criança.');
      return;
    }

    setIsDownloading(true);
    const element = certificateRef.current;
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: null
    });
    
    const image = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement('a');
    link.download = `Certificado-${childName.replace(/\s+/g, '-')}.png`;
    link.href = image;
    link.click();
    
    setIsDownloading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const styles = {
    container: {
      padding: '40px 20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: "'Outfit', sans-serif, system-ui",
      color: '#2C3E50'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
      alignItems: 'start'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      border: '1px solid #F1F5F9'
    },
    input: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      border: '2px solid #E1F5FE',
      outline: 'none',
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '20px',
      marginTop: '8px'
    },
    button: {
      width: '100%',
      background: '#2D8B3E',
      color: 'white',
      padding: '18px',
      borderRadius: '12px',
      border: 'none',
      fontWeight: '800',
      fontSize: '1.1rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 4px 0px #1e5c29',
      transition: 'all 0.2s'
    },
    preview: {
      width: '100%',
      aspectRatio: '800/583',
      background: `url(${certificateTemplate})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '8px',
      position: 'relative',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1E3A8A' }}>
          Gerador de Certificado TEA
        </h1>
        <p style={{ color: '#64748B' }}>Personalize o certificado do seu pequeno em segundos.</p>
      </div>

      <div style={styles.grid}>
        {/* Formulário */}
        <div style={styles.card}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award color="#2D8B3E" /> Dados da Criança
          </h2>
          
          <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Nome Completo</label>
          <input 
            type="text" 
            placeholder="Digite o nome aqui..."
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            style={styles.input}
          />

          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            style={{ ...styles.button, opacity: isDownloading ? 0.7 : 1 }}
          >
            {isDownloading ? <RefreshCw className="animate-spin" /> : <Download />}
            {isDownloading ? 'Gerando...' : 'Baixar Certificado'}
          </button>

          {showSuccess && (
            <div style={{ marginTop: '16px', color: '#2D8B3E', fontWeight: '800', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> Download realizado!
            </div>
          )}
        </div>

        {/* Visualização */}
        <div>
          <div style={{ marginBottom: '10px', fontSize: '0.85rem', fontWeight: '700', color: '#64748B' }}>Pré-visualização:</div>
          <div ref={certificateRef} style={styles.preview}>
            {/* Nome da Criança */}
            <div style={{ position: 'absolute', top: '37.5%', left: 0, right: 0, textAlign: 'center', padding: '0 60px' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: '900', color: '#1E3A8A', textTransform: 'uppercase' }}>
                {childName || '[NOME DA CRIANÇA]'}
              </span>
            </div>
            
            {/* Assinatura */}
            <div style={{ position: 'absolute', bottom: '8.5%', left: '18.5%', width: '28%', textAlign: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1E3A8A' }}>
                {educatorName}
              </span>
            </div>

            {/* Data */}
            <div style={{ position: 'absolute', bottom: '8.5%', right: '18.5%', width: '25%', textAlign: 'center' }}>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: '#1E3A8A' }}>
                {currentDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateApp;
