import React, { useState, useRef, useCallback } from "react";

// --- CONSTANTES ---
const PASTEL_COLORS = [
  "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF",
  "#E8BAFF", "#FFB3E6", "#B3FFE6", "#FFE0B3", "#B3D9FF",
  "#D4BAFF", "#FFBAD2", "#BAF2FF", "#FFE6BA", "#C9FFBA",
];

// --- COMPONENTES DO TEMPLATE SVG ---
function PuzzleBorderSVG({ width, height }) {
  const pieces = [];
  const size = 32;
  let ci = 0;
  for (let x = 0; x < width; x += size * 0.82) {
    pieces.push(
      <rect key={`t${x}`} x={x} y={0} width={size * 0.78} height={size * 0.65} rx={4}
        fill={PASTEL_COLORS[ci % PASTEL_COLORS.length]} opacity={0.55} />
    );
    ci++;
    pieces.push(
      <rect key={`b${x}`} x={x} y={height - size * 0.65} width={size * 0.78} height={size * 0.65} rx={4}
        fill={PASTEL_COLORS[(ci + 4) % PASTEL_COLORS.length]} opacity={0.55} />
    );
    ci++;
  }
  for (let y = size; y < height - size; y += size * 0.82) {
    pieces.push(
      <rect key={`l${y}`} x={0} y={y} width={size * 0.65} height={size * 0.78} rx={4}
        fill={PASTEL_COLORS[(ci + 2) % PASTEL_COLORS.length]} opacity={0.55} />
    );
    ci++;
    pieces.push(
      <rect key={`r${y}`} x={width - size * 0.65} y={y} width={size * 0.65} height={size * 0.78} rx={4}
        fill={PASTEL_COLORS[(ci + 6) % PASTEL_COLORS.length]} opacity={0.55} />
    );
    ci++;
  }
  return <>{pieces}</>;
}

function CertificateSVG({ childName, dateStr }) {
  const W = 720, H = 500;
  const educator = "Dra. Marinalva Santana";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", maxWidth: 720, display: "block" }}>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF8F0" />
          <stop offset="100%" stopColor="#F0F4FF" />
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#DAA520" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bg)" rx="8" />
      <PuzzleBorderSVG width={W} height={H} />
      <rect x="36" y="36" width={W - 72} height={H - 72} fill="none" stroke="#D4C5A9" strokeWidth="1.2" rx="4" strokeDasharray="6,4" />
      <text x={W / 2} y={85} textAnchor="middle" fontSize="30" fontWeight="800" fill="#5B6ABF"
        fontFamily="'Fredoka One', cursive" letterSpacing="2.5">CERTIFICADO DE CONCLUSÃO</text>
      <line x1={W / 2 - 150} y1={98} x2={W / 2 + 150} y2={98} stroke="#C8B898" strokeWidth="1" />
      <text x={W / 2} y={125} textAnchor="middle" fontSize="12.5" fill="#6B7280" fontFamily="'Nunito', sans-serif">
        Este certificado é concedido com orgulho a:</text>
      <text x={W / 2} y={168} textAnchor="middle" fontSize="28" fontWeight="700" fill="#3B4280"
        fontFamily="'Fredoka One', cursive">{childName || "[NOME DA CRIANÇA]"}</text>
      <line x1={W / 2 - 130} y1={178} x2={W / 2 + 130} y2={178} stroke="#9BA8E8" strokeWidth="1" strokeDasharray="4,3" />
      <text x={W / 2} y={210} textAnchor="middle" fontSize="11.5" fill="#6B7280" fontFamily="'Nunito', sans-serif">
        Por sua dedicação, progresso e superação no programa:</text>
      <rect x={W / 2 - 180} y={222} width={360} height={36} rx="6" fill="#E8ECF8" opacity="0.7" />
      <text x={W / 2} y={246} textAnchor="middle" fontSize="17" fontWeight="800" fill="#3B4280"
        fontFamily="'Fredoka One', cursive" letterSpacing="1.5">DESENVOLVIMENTO DE HABILIDADES</text>
      {/* Ribbon */}
      <g transform={`translate(${W / 2},305)`}>
        <polygon points="-10,7 -16,28 -5,21 0,32 5,21 16,28 10,7" fill="#7B8CDE" opacity="0.9" />
        <circle r="16" fill="#9BA8E8" stroke="#7B8CDE" strokeWidth="2" />
        <circle r="11" fill="#B8C2F0" stroke="white" strokeWidth="1.2" />
        <text textAnchor="middle" y="5" fontSize="6.5" fill="#4A5299" fontWeight="bold" fontFamily="sans-serif">CONQUISTA</text>
      </g>
      <text x={W / 2} y={362} textAnchor="middle" fontSize="12.5" fill="#7C8ABF" fontStyle="italic"
        fontFamily="'Nunito', sans-serif">Parabéns por sua jornada única e brilhante!</text>
      <line x1={130} y1={415} x2={300} y2={415} stroke="#B0B8D4" strokeWidth="1" />
      <text x={215} y={432} textAnchor="middle" fontSize="9.5" fill="#6B7280" fontFamily="'Nunito', sans-serif">
        {educator}</text>
      <line x1={420} y1={415} x2={590} y2={415} stroke="#B0B8D4" strokeWidth="1" />
      <text x={505} y={432} textAnchor="middle" fontSize="9.5" fill="#6B7280" fontFamily="'Nunito', sans-serif">
        {dateStr}</text>
      {/* Gold Seal */}
      {(() => {
        const cx = W - 68, cy = H - 68, pts = [];
        for (let i = 0; i < 24; i++) {
          const a = (i * Math.PI * 2) / 24 - Math.PI / 2;
          const r = i % 2 === 0 ? 24 : 17;
          pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
        }
        return (<g>
          <polygon points={pts.join(" ")} fill="url(#gold)" stroke="#B8860B" strokeWidth="1.2" />
          <circle cx={cx} cy={cy} r="14" fill="none" stroke="#DAA520" strokeWidth="0.8" />
          <text x={cx} y={cy - 1} textAnchor="middle" fontSize="6" fill="#8B6914" fontWeight="bold">SUCESSO</text>
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize="4.5" fill="#8B6914">★★★</text>
        </g>);
      })()}
    </svg>
  );
}

// --- PROGRAMA PRINCIPAL EXTRAÍDO ---
export default function GeradorCertificado() {
  const [childName, setChildName] = useState("");
  const [downloading, setDownloading] = useState(false);
  const svgRef = useRef(null);
  const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const handleDownload = useCallback(async () => {
    if (!childName.trim()) return;
    setDownloading(true);
    try {
      const svgEl = svgRef.current?.querySelector("svg");
      if (!svgEl) return;
      const clone = svgEl.cloneNode(true);
      clone.setAttribute("width", "1440");
      clone.setAttribute("height", "1000");
      const str = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([str], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const canvas = document.createElement("canvas");
      canvas.width = 1440; canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = "#FFF8F0";
        ctx.fillRect(0, 0, 1440, 1000);
        ctx.drawImage(img, 0, 0, 1440, 1000);
        URL.revokeObjectURL(url);
        canvas.toBlob(b => {
          const a = document.createElement("a");
          a.download = `certificado-${childName.replace(/\s+/g, "-").toLowerCase()}.png`;
          a.href = URL.createObjectURL(b);
          a.click();
          setDownloading(false);
        }, "image/png");
      };
      img.onerror = () => {
        const a = document.createElement("a");
        a.download = `certificado-${childName.replace(/\s+/g, "-").toLowerCase()}.svg`;
        a.href = url; a.click();
        setDownloading(false);
      };
      img.src = url;
    } catch { setDownloading(false); }
  }, [childName]);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", padding: "40px 20px", background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');`}</style>
      
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", padding: "24px 24px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🏆</div>
            <h2 style={{ color: "white", fontFamily: "'Fredoka One', cursive", fontSize: 20, margin: 0 }}>Gerador de Certificado</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 4 }}>Crie e baixe o certificado personalizado</p>
          </div>

          <div style={{ padding: "24px" }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: "#4b5563", display: "block", marginBottom: 6, letterSpacing: 0.5 }}>NOME DA CRIANÇA *</label>
              <input type="text" placeholder="Ex: Maria Helena" value={childName} onChange={e => setChildName(e.target.value)} maxLength={40}
                style={{ width: "100%", padding: "14px 16px", border: "2px solid #e5e7eb", borderRadius: 12, fontSize: 15, outline: "none", boxSizing: "border-box", background: "#fafbff" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, marginBottom: 4 }}>EDUCADORA</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Dra. Marinalva Santana</div>
              </div>
              <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: 0.5, marginBottom: 4 }}>DATA</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{today}</div>
              </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 1.5, marginBottom: 10, textAlign: "center" }}>PRÉ-VISUALIZAÇÃO</div>
            <div ref={svgRef} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", background: "#FFF8F0", marginBottom: 20 }}>
              <CertificateSVG childName={childName} dateStr={today} />
            </div>

            <button onClick={handleDownload} disabled={!childName.trim() || downloading}
              style={{ width: "100%", padding: "14px", background: !childName.trim() ? "#d1d5db" : "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: !childName.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {downloading ? "⏳ Gerando..." : "⬇️ Baixar Certificado em PNG"}
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 10 }}>Download em alta resolução pronto para imprimir</p>
          </div>
        </div>
      </div>
    </div>
  );
}
