import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SiDiscord, SiSpotify } from "react-icons/si";
import { Gamepad2 } from "lucide-react";

const USER_ID = "592055410509479960";
const API_URL = `https://api.lanyard.rest/v1/users/${USER_ID}`;

interface LanyardResponse {
  data: {
    discord_user: {
      username: string;
      discriminator: string;
      avatar: string;
      id: string;
      global_name: string | null;
    };
    discord_status: "online" | "idle" | "dnd" | "offline";
    activities: {
      type: number;
      name: string;
      state?: string;
      details?: string;
      assets?: {
        large_image?: string;
        small_image?: string;
        large_text?: string;
        small_text?: string;
      };
      session_id?: string;
      sync_id?: string;
    }[];
    active_on_discord_web: boolean;
    active_on_discord_mobile: boolean;
    active_on_discord_desktop: boolean;
  };
  success: boolean;
}

const statusColors = {
  online: "bg-green-500",
  idle: "bg-yellow-500",
  dnd: "bg-red-500",
  offline: "bg-gray-500",
};

const statusText = {
  online: "En ligne",
  idle: "Absent",
  dnd: "Ne pas déranger",
  offline: "Hors ligne",
};

export default function DiscordStatus() {
  const { data, isLoading, error } = useQuery<LanyardResponse>({
    queryKey: ["discord-status"],
    queryFn: async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch Discord status");
      return res.json();
    },
    refetchInterval: 10000, // Refresh every 10s
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto p-4 bg-black/40 backdrop-blur-md border-white/10 animate-pulse">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full bg-white/10" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3 bg-white/10" />
            <Skeleton className="h-3 w-1/4 bg-white/10" />
          </div>
        </div>
      </Card>
    );
  }

  if (error || !data?.success) return null;

  const { discord_user, discord_status, activities } = data.data;
  const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`;
  
  // Filter activities
  const spotify = activities.find(a => a.name === "Spotify");
  const game = activities.find(a => a.type === 0); // 0 is Playing
  const customStatus = activities.find(a => a.type === 4);
  
  const activity = spotify || game || customStatus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mb-6"
    >
      <Card className="relative overflow-hidden bg-black/30 backdrop-blur-xl border-white/10 p-4 transition-all hover:bg-black/40 group shadow-lg shadow-black/20">
        <div className="flex items-start gap-4">
          {/* Avatar & Status */}
          <div className="relative shrink-0">
            <Avatar className="h-16 w-16 border-2 border-white/5 shadow-md">
              <AvatarImage src={avatarUrl} alt={discord_user.username} />
              <AvatarFallback className="bg-white/10 text-white">{discord_user.username[0]}</AvatarFallback>
            </Avatar>
            
            {/* Status Indicator */}
            <div className="absolute -bottom-1 -right-1 bg-black p-1 rounded-full">
               <div className={`h-4 w-4 rounded-full border-2 border-black ${statusColors[discord_status]} animate-pulse`} 
                    title={statusText[discord_status]}
               />
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-1">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white leading-none tracking-wide flex items-center gap-2">
                  {discord_user.global_name || discord_user.username}
                  {discord_user.discriminator !== "0" && (
                    <span className="text-xs text-white/40 font-normal">#{discord_user.discriminator}</span>
                  )}
                </h3>
                <p className="text-xs text-white/50 mt-1 font-mono">@{discord_user.username}</p>
              </div>
              <SiDiscord className="text-[#5865F2] h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Activity Section */}
            <div className="mt-3 pt-3 border-t border-white/5">
              {activity ? (
                <div className="flex items-center gap-3 text-sm text-white/80">
                  {activity.name === "Spotify" ? (
                    <SiSpotify className="text-[#1DB954] h-5 w-5 shrink-0" />
                  ) : activity.type === 0 ? (
                    <Gamepad2 className="text-purple-400 h-5 w-5 shrink-0" />
                  ) : (
                    <div className="h-5 w-5 flex items-center justify-center text-lg">💭</div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {activity.name === "Spotify" ? activity.details : activity.name}
                    </p>
                    {(activity.state || activity.details) && activity.name !== "Spotify" && (
                       <p className="text-xs text-white/50 truncate">
                         {activity.state} {activity.details ? `- ${activity.details}` : ''}
                       </p>
                    )}
                    {activity.name === "Spotify" && (
                      <p className="text-xs text-white/50 truncate">
                        par {activity.state}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <div className={`h-1.5 w-1.5 rounded-full ${statusColors[discord_status]}`} />
                  {statusText[discord_status]}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Animated border gradient bottom */}
        <div className={`absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent ${
           discord_status === 'online' ? 'via-green-500' : 
           discord_status === 'dnd' ? 'via-red-500' : 
           discord_status === 'idle' ? 'via-yellow-500' : 'via-gray-500'
        } to-transparent opacity-50`} />
      </Card>
    </motion.div>
  );
}
