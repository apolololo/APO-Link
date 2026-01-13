import { 
  SiTwitch, 
  SiYoutube, 
  SiTiktok, 
  SiX,
  SiInstagram, 
  SiKickstarter,
  SiGithub,
  SiPaypal
} from "react-icons/si";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface Platform {
  name: string;
  url: string;
  icon: React.ComponentType;
  color: string;
  rgbColor: string;
}

const SocialGrid = () => {
  const isMobile = useIsMobile();
  const platforms: Platform[] = [
    {
      name: "Twitch",
      url: "https://www.twitch.tv/tryh_apo",
      icon: SiTwitch,
      color: "#9146FF",
      rgbColor: "145,70,255"
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@apo_ban",
      icon: SiTiktok,
      color: "#00F2EA",
      rgbColor: "0,242,234"
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@tryhapo",
      icon: SiYoutube,
      color: "#FF0000",
      rgbColor: "255,0,0"
    },
    {
      name: "X",
      url: "https://x.com/apoftn1",
      icon: SiX,
      color: "#FFFFFF",
      rgbColor: "255,255,255"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/tryh_apo",
      icon: SiInstagram,
      color: "#E4405F",
      rgbColor: "228,64,95"
    },
    {
      name: "GitHub",
      url: "https://github.com/apolololo",
      icon: SiGithub,
      color: "#FFFFFF",
      rgbColor: "255,255,255"
    },
    {
      name: "Kick",
      url: "https://kick.com/tryh-apo",
      icon: SiKickstarter,
      color: "#53FC18",
      rgbColor: "83,252,24"
    }
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="grid grid-cols-7 gap-6 md:gap-8 justify-center">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          
          return (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              data-platform={platform.name.toLowerCase()}
            >
              <div className="flex items-center justify-center">
                <div 
                  className={
                    isMobile
                      ? "relative text-white text-3xl sm:text-4xl"
                      : "relative text-white text-3xl sm:text-4xl transform transition-all duration-300 hover:scale-125 hover:filter animate-float"
                  }
                  style={
                    isMobile
                      ? {
                          filter: 'none',
                          textShadow: 'none',
                          color: 'white'
                        }
                      : {
                          animationDuration: `${3 + (platforms.indexOf(platform) % 5) * 0.5}s`,
                          filter: 'brightness(1)',
                          textShadow: '0 0 5px rgba(255,255,255,0.3)'
                        }
                  }
                  onMouseEnter={
                    isMobile
                      ? undefined
                      : (e) => {
                          e.currentTarget.style.filter = `drop-shadow(0 0 8px rgba(${platform.rgbColor},0.6))`;
                          e.currentTarget.style.color = platform.color;
                        }
                  }
                  onMouseLeave={
                    isMobile
                      ? undefined
                      : (e) => {
                          e.currentTarget.style.filter = 'brightness(1)';
                          e.currentTarget.style.color = 'white';
                        }
                  }
                >
                  <Icon />
                  {!isMobile && (
                    <div className="absolute inset-0 opacity-0 hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 flex items-center justify-center gap-3"
      >
        <a
          href="https://streamelements.com/tryh_apo/tip"
          target="_blank"
          rel="noopener noreferrer"
          className={
            isMobile
              ? "flex items-center gap-2 px-4 py-2 rounded-full mobile-glass"
              : "flex items-center gap-2 px-4 py-2 bg-[#0070BA]/10 rounded-full transition-all duration-300 hover:bg-[#0070BA]/20"
          }
          data-platform="paypal"
        >
          <SiPaypal className={isMobile ? "text-white/90 text-sm" : "text-[#0070BA] text-sm"} />
          <span className="text-white/80 text-sm">Me soutenir</span>
        </a>
      </motion.div>
    </div>
  );
};

export default SocialGrid;
