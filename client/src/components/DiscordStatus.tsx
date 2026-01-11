import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  discriminator: string;
  avatar: string | null;
  public_flags: number;
  flags: number;
  banner: string | null;
  accent_color: number | null;
  avatar_decoration_data: any;
  banner_color: string | null;
  clan?: {
    identity_guild_id: string;
    identity_enabled: boolean;
    tag: string;
    badge: string;
  };
  primary_guild?: {
    identity_guild_id: string;
    identity_enabled: boolean;
    tag: string;
    badge: string;
  };
  tag?: string;
  createdAt: string;
  createdTimestamp: number;
  public_flags_array?: string[];
  defaultAvatarURL: string;
  avatarURL: string;
  bannerURL: string | null;
}

interface DiscordAPIResponse {
  cache_expiry: number;
  cached: boolean;
  data: {
    user: DiscordUser;
    presence?: {
      error?: string;
    };
  };
}

const USER_ID = "592055410509479960";
const JAPI_URL = `https://japi.rest/discord/v1/user/${USER_ID}`;

const statusColors = {
  online: "#23a55a",
  idle: "#f0b232", 
  dnd: "#f23f43",
  offline: "#80848e"
};

const badgeMap: Record<string, string> = {
  DISCORD_EMPLOYEE: "👔",
  PARTNERED_SERVER_OWNER: "🤝",
  HYPESQUAD_EVENTS: "🎉",
  BUGHUNTER_LEVEL_1: "🐛",
  BUGHUNTER_LEVEL_2: "🐞",
  EARLY_SUPPORTER: "💎",
  VERIFIED_BOT_DEVELOPER: "🤖",
  ACTIVE_DEVELOPER: "⚙️",
  HOUSE_BRAVERY: "🔥",
  HOUSE_BRILLIANCE: "💡",
  HOUSE_BALANCE: "⚖️"
};

export default function DiscordStatus() {
  const [discordData, setDiscordData] = useState<DiscordAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchDiscordData = async () => {
      try {
        const response = await fetch(JAPI_URL);
        const data: DiscordAPIResponse = await response.json();
        
        if (mounted && data.data?.user) {
          setDiscordData(data);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(() => fetchDiscordData(), 2000 * retryCount);
          } else {
            setError("Impossible de récupérer les données Discord");
            setIsLoading(false);
          }
        }
      }
    };

    fetchDiscordData();
    const interval = setInterval(fetchDiscordData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10 w-80">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (error || !discordData?.data?.user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10 w-80">
          <div className="text-center text-red-400">
            <p className="text-sm">{error || "Erreur de chargement"}</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  const user = discordData.data.user;
  const clanTag = user.clan?.tag || user.primary_guild?.tag || user.tag;
  const displayName = user.global_name || user.username;
  const usernameWithDiscriminator = user.discriminator && user.discriminator !== "0" 
    ? `${user.username}#${user.discriminator}` 
    : `@${user.username}`;

  const getBadges = () => {
    const badges: string[] = [];
    if (user.public_flags_array) {
      user.public_flags_array.forEach(flag => {
        if (badgeMap[flag]) {
          badges.push(badgeMap[flag]);
        }
      });
    }
    return badges;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10"
    >
      <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10 w-80 hover:bg-black/50 transition-all duration-300">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage 
              src={user.avatarURL} 
              alt={user.username}
              className="rounded-full"
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-lg">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white text-lg truncate">
                {displayName}
              </h3>
              {clanTag && (
                <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold rounded-full">
                  {clanTag}
                </span>
              )}
            </div>
            
            <p className="text-gray-300 text-sm opacity-80 mb-2">
              {usernameWithDiscriminator}
            </p>
            
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: statusColors.offline }}
              />
              <span className="text-gray-300 text-sm">Hors ligne</span>
            </div>
            
            {getBadges().length > 0 && (
              <div className="flex gap-1">
                {getBadges().map((badge, index) => (
                  <span key={index} className="text-lg" title={badge}>
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}