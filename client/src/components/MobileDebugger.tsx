import { useEffect, useState } from 'react';

const MobileDebugger = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const info: string[] = [];
    
    // Vérifier si c'est mobile
    const isMobile = window.innerWidth < 768;
    info.push(`Mobile: ${isMobile}`);
    info.push(`Width: ${window.innerWidth}px`);
    info.push(`Height: ${window.innerHeight}px`);
    
    // Vérifier le user agent
    info.push(`User Agent: ${navigator.userAgent.slice(0, 50)}...`);
    
    // Vérifier si le DOM est chargé
    const root = document.getElementById('root');
    info.push(`Root exists: ${!!root}`);
    
    // Vérifier le body
    info.push(`Body visible: ${document.body.style.visibility !== 'hidden'}`);
    info.push(`Body overflow: ${document.body.style.overflow}`);
    
    // Vérifier le canvas
    const canvas = document.querySelector('canvas');
    info.push(`Canvas exists: ${!!canvas}`);
    
    // Vérifier les styles
    const computedStyle = window.getComputedStyle(document.body);
    info.push(`Body bg: ${computedStyle.backgroundColor}`);
    info.push(`Body display: ${computedStyle.display}`);
    
    setDebugInfo(info);
  }, []);

  if (window.innerWidth >= 768) return null;

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white text-xs p-2 rounded z-50 max-w-xs">
      <h3 className="font-bold mb-2">Mobile Debug</h3>
      {debugInfo.map((info, index) => (
        <div key={index}>{info}</div>
      ))}
    </div>
  );
};

export default MobileDebugger;