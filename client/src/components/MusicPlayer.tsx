import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const GITHUB_MUSIC_URL = 'https://raw.githubusercontent.com/apolololo/APO-Link/main/musique';

export default function MusicPlayer() {
  const isMobile = useIsMobile();
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number>();
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/apolololo/APO-Link/contents/musique')
      .then(response => response.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('Unexpected data format:', data);
          return;
        }

        const musicFiles = data
          .filter((file) => file && typeof file === 'object' && file.type === 'file')
          .filter((file) => {
            // Filtrer uniquement les fichiers audio
            const extension = file.name.split('.').pop()?.toLowerCase();
            return ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension || '');
          })
          .map((file) => `${GITHUB_MUSIC_URL}/${file.name}`);

        const shuffledTracks = [...musicFiles].sort(() => Math.random() - 0.5);
        setTracks(shuffledTracks);
      })
      .catch(error => console.error('Error fetching music files:', error));
  }, []);

  // Débloquer l'autoplay avec un événement utilisateur
  useEffect(() => {
    if (tracks.length === 0 || !audioRef.current) return;

    const unlockAndPlay = () => {
      if (!audioRef.current || tracks.length === 0) return;
      
      // Si déjà en train de jouer, ne rien faire
      if (!audioRef.current.paused) return;
      
      // Essayer de jouer
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.warn("Autoplay prevented:", error);
            setIsPlaying(false);
          });
      }
    };

    // Essayer de jouer immédiatement au chargement
    const tryAutoplay = () => {
      if (audioRef.current && tracks.length > 0) {
        audioRef.current.volume = 0.5;
        
        // Charger et jouer
        audioRef.current.load();
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Autoplay started successfully");
              setIsPlaying(true);
            })
            .catch(error => {
              console.warn("Autoplay blocked, waiting for interaction:", error);
              // Si bloqué, on attend une interaction
            });
        }
      }
    };

    // Essayer immédiatement
    tryAutoplay();

    // Débloquer l'audio dès qu'un événement utilisateur se produit
    const events = ['click', 'touchstart', 'keydown', 'mousemove', 'scroll'];
    
    // Wrapper pour ne déclencher unlockAndPlay qu'une fois
    const handleInteraction = () => {
      unlockAndPlay();
      // Nettoyer les écouteurs après la première interaction réussie
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
    
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, [tracks]); // On ne met pas 'volume' ici pour éviter les boucles


  // Mise à jour du volume de l'élément audio quand le state change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Gérer le changement de piste
  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      // Si c'est le premier chargement (currentTrack 0 et pas playing), on ne fait rien car tryAutoplay s'en charge
      // Mais si on change de piste manuellement ou automatiquement...
      if (isPlaying) {
         // Ce bloc gère les changements de piste QUAND ça joue déjà
         // On ne veut pas reset le volume ici, sauf si demandé
      }
    }
  }, [currentTrack, tracks]);

  // Effet pour s'assurer que la musique continue de jouer
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const ensurePlaying = () => {
        if (audioRef.current && audioRef.current.paused && !audioRef.current.ended) {
          audioRef.current.play().catch(console.error);
        }
      };

      const checkInterval = setInterval(ensurePlaying, 1000);
      
      const handlePause = () => {
        if (!audioRef.current?.ended && isPlaying) {
           // Si mis en pause mais qu'on est censé jouer, on relance
           // Sauf si c'est l'utilisateur qui a mis pause (mais on n'a pas de bouton pause visible ici, juste mute)
           audioRef.current?.play().catch(console.error);
        }
      };

      audioRef.current.addEventListener('pause', handlePause);

      return () => {
        clearInterval(checkInterval);
        if (audioRef.current) {
            audioRef.current.removeEventListener('pause', handlePause);
        }
      };
    }
  }, [isPlaying]);

  // Handle mouse enter/leave for the player
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playerRef.current && !playerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    // User intervention stops the fade-in
    if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
    }
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const skipTrack = () => {
    if (tracks.length > 0) {
        setCurrentTrack((prev) => (prev + 1) % tracks.length);
        // Note: L'audio element va recharger automatiquement car src change
        // On doit attendre que le src change pour jouer
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(console.error);
            }
        }, 100);
    }
  };

  const handleTrackEnd = () => {
    skipTrack();
  };

  if (tracks.length === 0) return null;

  return (
    <div 
      className="fixed bottom-8 left-8 z-50" 
      ref={playerRef}
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && setIsExpanded(false)}
    >
      {isMobile ? (
        <div className="relative flex items-center">
          <div 
            className="flex items-center justify-center w-10 h-10 bg-black/50 backdrop-blur-lg rounded-full border border-white/10 z-10"
          >
            <Music className="h-5 w-5 text-white/80" />
          </div>
          <div className="absolute left-8 flex items-center gap-3 bg-black/50 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10">
          <audio
            ref={audioRef}
            src={tracks[currentTrack]}
            onEnded={handleTrackEnd}
            // Removed autoPlay={true} to handle it via JS for better control
          />

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/80 h-8 w-8 ml-2"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/80 h-8 w-8"
            onClick={skipTrack}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center"
        >
          <div 
            className="flex items-center justify-center w-10 h-10 bg-black/50 backdrop-blur-lg rounded-full cursor-pointer border border-white/10 z-10"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Music className="h-5 w-5 text-white/80" />
          </div>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: isExpanded ? "auto" : 0, 
              opacity: isExpanded ? 1 : 0,
              x: isExpanded ? 0 : -10
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut" 
            }}
            className="absolute left-8 overflow-hidden flex items-center gap-3 bg-black/50 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10"
          >
            <audio
              ref={audioRef}
              src={tracks[currentTrack]}
              onEnded={handleTrackEnd}
              // Removed autoPlay={true} to handle it via JS for better control
            />

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80 h-8 w-8 ml-2"
              onClick={toggleMute}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80 h-8 w-8"
              onClick={skipTrack}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
