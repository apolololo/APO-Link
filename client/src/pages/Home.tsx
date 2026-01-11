import DotCanvas from "@/components/DotCanvas";
import Header from "@/components/Header";
import SocialGrid from "@/components/SocialGrid";
import DotTicTacToe from "../components/DotTicTacToe";
import MusicPlayer from "@/components/MusicPlayer";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();

  // Désactiver la sélection de texte pour une meilleure expérience interactive
  useEffect(() => {
    document.body.style.userSelect = 'none';
    
    // Débloquer l'autoplay audio au premier clic/touch
    const unlockAudio = () => {
      // Déclencher un événement pour débloquer l'audio
      const event = new Event('click');
      document.dispatchEvent(event);
    };
    
    // Essayer de débloquer immédiatement avec un événement de mouvement de souris
    const handleFirstInteraction = () => {
      unlockAudio();
      document.removeEventListener('mousemove', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };
    
    document.addEventListener('mousemove', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('click', handleFirstInteraction, { once: true });
    
    return () => {
      document.body.style.userSelect = '';
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Débogage mobile */}
      {isMobile && <MobileDebugger />}
      
      {/* Fond avec les étoiles - désactivé sur mobile */}
      {!isMobile && <DotCanvas />}
      
      {/* Contenu scrollable avec fond transparent */}
      <div className="relative z-10 bg-transparent">
        
        {/* Section principale avec les liens */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <Header />
        <div className="mt-2">
          <SocialGrid />
        </div>
        </section>
      </div>
      
      {/* Mini-jeu discret sur le côté - désactivé sur mobile */}
      {!isMobile && <DotTicTacToe />}
      
      {/* Lecteur de musique - désactivé sur mobile */}
      {!isMobile && <MusicPlayer />}
    </div>
  );
}