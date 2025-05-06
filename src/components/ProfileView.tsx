
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProfile, getDocumentName, getProfilePictureUrl } from '@/services/storageService';
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

const ProfileView: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [documentName, setDocumentName] = useState<string>('');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const profileData = await getProfile(user.id);
        setProfile(profileData);
        
        if (profileData?.documentUploaded) {
          const docName = getDocumentName(profileData.documentUploaded);
          setDocumentName(docName);
        }
        
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
          Por favor, complete seu perfil para ver seus dados.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Dados do Perfil</h1>
      
      <div className="text-center mb-6">
        <Avatar className="w-24 h-24 mx-auto border-2 border-furia-gold">
          {profilePictureUrl ? (
            <AvatarImage src={profilePictureUrl} alt={profile.name} className="object-cover" />
          ) : (
            <AvatarFallback className="text-4xl font-bold text-furia-gold">
              {profile.name.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
      
      <div className="furia-card mb-4">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="text-furia-gold font-medium py-2">ID do Usuário:</td>
              <td className="py-2 text-right">{profile.userId}</td>
            </tr>
            <tr>
              <td className="text-furia-gold font-medium py-2">Nome:</td>
              <td className="py-2 text-right">{profile.name}</td>
            </tr>
            {profile.gender && (
              <tr>
                <td className="text-furia-gold font-medium py-2">Gênero:</td>
                <td className="py-2 text-right">{profile.gender}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="furia-card mb-4">
        <h2 className="text-lg font-bold mb-3 text-furia-gold">Jogos Favoritos</h2>
        {profile.favoriteGames.length > 0 ? (
          <ul className="list-disc pl-5">
            {profile.favoriteGames.map((game) => (
              <li key={game} className="py-1">{game}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Nenhum jogo selecionado</p>
        )}
      </div>
      
      <div className="furia-card mb-4">
        <h2 className="text-lg font-bold mb-3 text-furia-gold">Jogadores Favoritos</h2>
        {profile.favoritePlayers.length > 0 ? (
          <ul className="list-disc pl-5">
            {profile.favoritePlayers.map((player) => (
              <li key={player} className="py-1">{player}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Nenhum jogador selecionado</p>
        )}
      </div>
      
      <div className="furia-card mb-4">
        <h2 className="text-lg font-bold mb-3 text-furia-gold">Streamers Favoritos</h2>
        {profile.favoriteStreamers && profile.favoriteStreamers.length > 0 ? (
          <ul className="list-disc pl-5">
            {profile.favoriteStreamers.map((streamer, index) => (
              <li key={index} className="py-1">{streamer}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Nenhum streamer selecionado</p>
        )}
      </div>
      
      <div className="furia-card mb-4">
        <h2 className="text-lg font-bold mb-3 text-furia-gold">Redes Sociais</h2>
        {profile.socialLinks.length > 0 ? (
          <ul className="list-disc pl-5">
            {profile.socialLinks.map((link, index) => (
              <li key={index} className="py-1 break-all">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-furia-gold/80 hover:text-furia-gold"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Nenhuma rede social informada</p>
        )}
      </div>
      
      <div className="furia-card mb-4">
        <h2 className="text-lg font-bold mb-3 text-furia-gold">Documento</h2>
        {profile.documentUploaded ? (
          <div>
            <p>ID do documento: {profile.documentUploaded}</p>
            <p>Nome do arquivo: {documentName}</p>
          </div>
        ) : (
          <p className="text-gray-400">Nenhum documento enviado</p>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
