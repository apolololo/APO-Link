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
    
    return () => {
      document.body.style.userSelect = '';
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Fond avec les étoiles - fixe en arrière-plan */}
      <DotCanvas />
      
      {/* Contenu scrollable */}
      <div className="relative z-10 w-full h-full overflow-y-auto">
        {!isMobile && <CustomCursor />}
        
        {/* Section principale avec les liens */}
        <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4 md:py-0">
        <Header />
        <div className="mt-8 mb-20 md:mb-0">
          <SocialGrid />
        </div>
        </section>
        
      </div>
      
      {/* Lecteur de musique */}
      <MusicPlayer />
    </div>
  );
}
