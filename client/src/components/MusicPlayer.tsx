import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Music, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const playerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Charger les musiques depuis GitHub
  useEffect(() => {
    fetch('https://api.github.com/repos/apolololo/APO-Link/contents/musique')
      .then(response => response.json())
      .then(data => {
        if (!Array.isArray(data)) return;

        const musicFiles = data
          .filter((file: any) => file && typeof file === 'object' && file.type === 'file')
          .filter((file: any) => {
            const extension = file.name.split('.').pop()?.toLowerCase();
            return ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension || '');
          })
          .map((file: any) => `${GITHUB_MUSIC_URL}/${file.name}`);

        setTracks([...musicFiles].sort(() => Math.random() - 0.5));
      })
      .catch(console.error);
  }, []);

  // Initialisation Web Audio API encapsulée
  const initWebAudio = () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const gainNode = ctx.createGain();
      gainNodeRef.current = gainNode;

      // On connecte l'élément audio
      if (!sourceNodeRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        sourceNodeRef.current = source;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
      }
      
      // Appliquer le volume initial
      gainNode.gain.value = isMuted ? 0 : volume;
    } catch (e) {
      console.error("Web Audio API setup failed:", e);
    }
  };

  // Tentative d'initialisation au montage (peut échouer si autoplay policy stricte)
  useEffect(() => {
    initWebAudio();
  }, []);

  // Déverrouillage robuste de l'audio sur interaction
  useEffect(() => {
    const unlockAudio = () => {
      // 1. Initialiser si pas fait
      if (!audioContextRef.current) {
        initWebAudio();
      }

      // 2. Resume si suspendu
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().then(() => {
          console.log("AudioContext resumed by user interaction");
        });
      }
    };

    const events = ['click', 'touchstart', 'keydown', 'mousemove'];
    events.forEach(e => document.addEventListener(e, unlockAudio, { passive: true }));

    return () => {
      events.forEach(e => document.removeEventListener(e, unlockAudio));
    };
  }, []);

  // Gestion du volume via Web Audio API et élément audio standard
  useEffect(() => {
    const vol = isMuted ? 0 : volume;

    // Méthode 1: Standard (pour Desktop/Android)
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }

    // Méthode 2: Web Audio API (pour iOS)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = vol;
    }
  }, [volume, isMuted]);

  // Autoplay intelligent sur mobile et desktop
  useEffect(() => {
    if (tracks.length === 0) return;

    const attemptPlay = () => {
      // Réactiver le contexte audio (nécessaire pour Chrome/iOS)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            // Une fois que ça joue, on peut retirer les écouteurs
            ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'].forEach(event => {
              document.removeEventListener(event, attemptPlay);
            });
          })
          .catch((e) => {
            // Autoplay bloqué, on attend la prochaine interaction
            console.log("Autoplay waiting for interaction");
          });
      }
    };

    // Essayer tout de suite
    attemptPlay();

    // Et écouter toutes les interactions possibles
    ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'].forEach(event => {
      document.addEventListener(event, attemptPlay, { passive: true });
    });

    return () => {
      ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'].forEach(event => {
        document.removeEventListener(event, attemptPlay);
      });
    };
  }, [tracks]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    // Réactiver le contexte audio au clic
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    // On laisse l'autoplay gérer la lecture après changement de src
    setTimeout(() => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      if (audioRef.current) audioRef.current.play().catch(console.error);
    }, 100);
  };


  const handleTrackEnd = () => {
    skipTrack();
  };

  if (tracks.length === 0) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={tracks[currentTrack]}
        onEnded={handleTrackEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="auto"
        playsInline
        crossOrigin="anonymous"
      />
      
      <div 
        ref={playerRef}
        className="fixed bottom-8 left-8 z-[100]"
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
      >
        {isMobile ? (
          <MobileControls 
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            volume={volume}
            setVolume={setVolume}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            skipTrack={skipTrack}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
          />
        ) : (
          <DesktopControls 
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            volume={volume}
            setVolume={setVolume}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            skipTrack={skipTrack}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
          />
        )}
      </div>
    </>
  );
}

// Composant Mobile Dédié avec gestion robuste des événements tactiles
function MobileControls({ 
  isExpanded, 
  setIsExpanded, 
  volume, 
  setVolume, 
  isMuted, 
  setIsMuted, 
  skipTrack,
  isPlaying,
  togglePlay
}: any) {
  
  return (
    <div className="relative flex items-center">
      {/* Bouton Principal - Toggle */}
      <button 
        className="flex items-center justify-center w-12 h-12 bg-black/60 backdrop-blur-xl rounded-full border border-white/20 shadow-lg active:scale-95 transition-transform z-20"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        onTouchEnd={(e) => {
          // Fallback pour certains navigateurs mobiles si onClick est capricieux
          e.stopPropagation();
          // e.preventDefault(); // Attention: preventDefault ici peut bloquer le click
        }}
      >
        <Music className={`h-6 w-6 ${isPlaying ? 'text-[#29abe0] animate-pulse' : 'text-white/80'}`} />
      </button>

      {/* Contrôles Étendus */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="absolute left-10 flex items-center gap-4 bg-black/60 backdrop-blur-xl rounded-r-full pl-6 pr-5 py-3 border-y border-r border-white/20 h-12 shadow-lg"
            style={{ marginLeft: '-10px' }} // Chevauchement esthétique
            onClick={(e) => e.stopPropagation()}
          >
            {/* Play/Pause (utile si autoplay échoue) */}
            <button
              className="text-white hover:text-[#29abe0] active:scale-90 transition-all"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            {/* Volume Slider - Touch Action None pour empêcher le scroll */}
            <div 
              className="relative w-24 h-6 flex items-center"
              onTouchMove={(e) => e.stopPropagation()} // Stop propagation to prevent scroll
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const newVol = parseFloat(e.target.value);
                  setVolume(newVol);
                  if (newVol > 0) setIsMuted(false);
                }}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                style={{ touchAction: 'none' }} // Critical for mobile sliders
              />
            </div>

            {/* Skip Button */}
            <button
              className="text-white hover:text-white/80 active:scale-90 transition-all"
              onClick={skipTrack}
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Composant Desktop (similaire à avant mais nettoyé)
function DesktopControls({ 
  isExpanded, 
  setIsExpanded, 
  volume, 
  setVolume, 
  isMuted, 
  setIsMuted, 
  skipTrack,
  isPlaying,
  togglePlay
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center"
    >
      <div 
        className="flex items-center justify-center w-10 h-10 bg-black/50 backdrop-blur-lg rounded-full cursor-pointer border border-white/10 z-10 hover:bg-black/70 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Music className={`h-5 w-5 ${isPlaying ? 'text-[#29abe0]' : 'text-white/80'}`} />
      </div>

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: isExpanded ? "auto" : 0, 
          opacity: isExpanded ? 1 : 0,
          x: isExpanded ? 0 : -10
        }}
        className="absolute left-8 overflow-hidden flex items-center gap-3 bg-black/50 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10"
      >
        <button
          className="text-white hover:text-[#29abe0] h-8 w-8 ml-2 flex items-center justify-center"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
             const newVol = parseFloat(e.target.value);
             setVolume(newVol);
             if (newVol > 0) setIsMuted(false);
          }}
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
  );
}
