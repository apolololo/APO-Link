import DotCanvasSimple from "@/components/DotCanvasSimple";
import Header from "@/components/Header";
import SocialGrid from "@/components/SocialGrid";
import { useEffect } from "react";

export default function HomeTest() {
  // Désactiver la sélection de texte pour une meilleure expérience interactive
  useEffect(() => {
    document.body.style.userSelect = 'none';
    
    return () => {
      document.body.style.userSelect = '';
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {/* Fond avec les étoiles - fixe en arrière-plan */}
      <DotCanvasSimple />
      
      {/* Contenu scrollable avec fond transparent */}
      <div className="relative z-10 bg-transparent">
        
        {/* Section principale avec les liens */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <Header />
        <div className="mt-8">
          <SocialGrid />
        </div>
        </section>
        
        {/* Section Jeu */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-8">Test Canvas Simple</h2>
            <p className="text-xl text-gray-400">Si vous voyez ce texte et des étoiles, le canvas fonctionne</p>
          </div>
        </section>
      </div>
    </div>
  );
}