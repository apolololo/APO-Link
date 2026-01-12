import DotCanvas from "@/components/DotCanvas";
import Header from "@/components/Header";
import SocialGrid from "@/components/SocialGrid";
import CustomCursor from "@/components/CustomCursor";
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
    <div className="relative w-full">
      {/* Fond avec les étoiles - fixe en arrière-plan */}
      <DotCanvas />
      
      {/* Contenu scrollable */}
      <div className="relative z-10">
        {!isMobile && <CustomCursor />}
        
        {/* Section principale avec les liens */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <Header />
        <div className="mt-8">
          <SocialGrid />
        </div>
        </section>
        
      </div>
      
      {/* Lecteur de musique */}
      <MusicPlayer />
    </div>
  );
}
