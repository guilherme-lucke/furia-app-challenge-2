
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProfile, getProfilePictureUrl } from '@/services/storageService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type Profile = {
  userId: string;
  name: string;
  favoriteGames: string[];
  favoritePlayers: string[];
  favoriteStreamers: string[]; // Updated from favoriteStreamer (string)
  gender?: string;
  socialLinks: string[];
  documentUploaded?: string;
  profilePicture?: string; // Added profile picture
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const profileData = await getProfile(user.id);
        setProfile(profileData);
        
        if (profileData?.profilePicture) {
          const pictureUrl = getProfilePictureUrl(profileData.profilePicture);
          setProfilePictureUrl(pictureUrl);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-pulse text-furia-gold">Carregando...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-4">Sem dados de perfil</h2>
        <p className="text-gray-400 mb-6">
          Por favor, complete seu perfil para ver seu dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20 animate-fade-in">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-furia-black via-furia-gold/20 to-furia-black" />
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-furia-black rounded-full p-1 border-2 border-furia-gold">
          <Avatar className="w-24 h-24 bg-furia-black flex items-center justify-center">
            {profilePictureUrl ? (
              <AvatarImage src={profilePictureUrl} alt={profile.name} className="object-cover" />
            ) : (
              <AvatarFallback className="text-4xl font-bold text-furia-gold">
                {profile.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
      
      <div className="mt-20 text-center mb-8">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="text-furia-gold">Fã FURIA</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 p-4">
        {profile.favoriteGames.length > 0 && (
          <div className="furia-card">
            <h2 className="text-lg font-bold mb-3 text-furia-gold">Jogos Favoritos</h2>
            <div className="flex flex-wrap gap-2">
              {profile.favoriteGames.map((game) => (
                <span
                  key={game}
                  className="px-3 py-1 bg-furia-black border border-furia-gold/30 rounded-full text-sm"
                >
                  {game}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {profile.favoritePlayers.length > 0 && (
          <div className="furia-card">
            <h2 className="text-lg font-bold mb-3 text-furia-gold">Jogadores Favoritos</h2>
            <div className="flex flex-wrap gap-2">
              {profile.favoritePlayers.map((player) => (
                <div
                  key={player}
                  className="flex items-center px-3 py-1 bg-furia-black border border-furia-gold/30 rounded-full text-sm"
                >
                  {player}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {profile.favoriteStreamers && profile.favoriteStreamers.length > 0 && (
          <div className="furia-card">
            <h2 className="text-lg font-bold mb-3 text-furia-gold">Streamers Favoritos</h2>
            <div className="flex flex-wrap gap-2">
              {profile.favoriteStreamers.map((streamer, index) => (
                <div
                  key={index}
                  className="flex items-center px-3 py-1 bg-furia-black border border-furia-gold/30 rounded-full text-sm"
                >
                  {streamer}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {profile.socialLinks.length > 0 && (
          <div className="furia-card">
            <h2 className="text-lg font-bold mb-3 text-furia-gold">Redes Sociais</h2>
            <div className="space-y-2">
              {profile.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate hover:text-furia-gold"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}
        
        {profile.documentUploaded && (
          <div className="furia-card">
            <h2 className="text-lg font-bold mb-3 text-furia-gold">Documentação</h2>
            <div className="bg-furia-black border border-furia-gold/30 rounded-lg p-3">
              Documento enviado ✓
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
