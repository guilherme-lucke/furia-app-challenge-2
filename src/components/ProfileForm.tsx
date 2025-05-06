
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { saveProfile, uploadDocument, uploadProfilePicture, getProfile, getProfilePictureUrl } from '@/services/storageService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import TagInput from '@/components/ui/tag-input';

const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [favoriteGames, setFavoriteGames] = useState<string[]>([]);
  const [favoritePlayers, setFavoritePlayers] = useState<string[]>([]);
  const [favoriteStreamers, setFavoriteStreamers] = useState<string[]>([]);
  const [gender, setGender] = useState('');
  const [socialLinks, setSocialLinks] = useState<string[]>(['']);
  const [document, setDocument] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [profilePictureKey, setProfilePictureKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const gameOptions = ['CS2', 'PUBG Mobile', 'LoL', 'R6', 'Rocket League', 'Valorant', 'Apex', 'Automobilismo'];
  const playerOptions = ['FalleN', 'kscerato', 'arT', 'yuurih', 'VINI', 'drop', 'saffee', 'chelo', 'frozen'];

  useEffect(() => {
    // Load existing profile data if user is authenticated
    if (user) {
      const loadProfileData = async () => {
        try {
          const profileData = await getProfile(user.id);
          if (profileData) {
            setName(profileData.name || '');
            setFavoriteGames(profileData.favoriteGames || []);
            setFavoritePlayers(profileData.favoritePlayers || []);
            setFavoriteStreamers(profileData.favoriteStreamers || []);
            setGender(profileData.gender || '');
            setSocialLinks(profileData.socialLinks.length ? profileData.socialLinks : ['']);
            
            if (profileData.profilePicture) {
              setProfilePictureKey(profileData.profilePicture);
              const pictureUrl = getProfilePictureUrl(profileData.profilePicture);
              if (pictureUrl) {
                setProfilePicturePreview(pictureUrl);
              }
            }
          }
        } catch (error) {
          console.error('Error loading profile data:', error);
        }
      };
      
      loadProfileData();
    }
  }, [user]);

  const handleGamesChange = (game: string) => {
    setFavoriteGames(prevGames =>
      prevGames.includes(game)
        ? prevGames.filter(g => g !== game)
        : [...prevGames, game]
    );
  };

  const handleAddPlayer = (player: string) => {
    if (!favoritePlayers.includes(player)) {
      setFavoritePlayers([...favoritePlayers, player]);
    }
  };

  const handleRemovePlayer = (index: number) => {
    setFavoritePlayers(favoritePlayers.filter((_, i) => i !== index));
  };

  const handleAddStreamer = (streamer: string) => {
    if (!favoriteStreamers.includes(streamer)) {
      setFavoriteStreamers([...favoriteStreamers, streamer]);
    }
  };

  const handleRemoveStreamer = (index: number) => {
    setFavoriteStreamers(favoriteStreamers.filter((_, i) => i !== index));
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = value;
    setSocialLinks(updatedLinks);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, '']);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload document if selected
      let documentId = undefined;
      if (document) {
        documentId = await uploadDocument(user.id, document);
      }
      
      // Upload profile picture if selected
      let profilePictureId = profilePictureKey;
      if (profilePicture) {
        profilePictureId = await uploadProfilePicture(user.id, profilePicture);
      }
      
      // Filter out empty social links
      const filteredSocialLinks = socialLinks.filter(link => link.trim() !== '');
      
      // Save profile data
      await saveProfile({
        userId: user.id,
        name,
        favoriteGames,
        favoritePlayers,
        favoriteStreamers,
        gender: gender || undefined,
        socialLinks: filteredSocialLinks,
        documentUploaded: documentId,
        profilePicture: profilePictureId || undefined,
      });
      
      toast.success('Perfil salvo com sucesso!');
      navigate('/dash');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pb-20 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Seu Perfil de Fã
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center justify-center mb-6">
          <label htmlFor="profilePicture" className="cursor-pointer">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-furia-gold group-hover:border-opacity-80 transition-all">
                <AvatarImage src={profilePicturePreview || ''} alt={name} />
                <AvatarFallback className="bg-furia-black text-furia-gold">
                  {name ? name.charAt(0).toUpperCase() : 'F'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white h-8 w-8" />
              </div>
            </div>
            <p className="text-sm text-center mt-2 text-furia-gold">
              Alterar foto
            </p>
          </label>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden"
          />
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nome Completo
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="furia-input w-full"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Jogos Favoritos da FURIA
          </label>
          <div className="grid grid-cols-2 gap-2">
            {gameOptions.map((game) => (
              <div key={game} className="flex items-center">
                <input
                  id={`game-${game}`}
                  type="checkbox"
                  checked={favoriteGames.includes(game)}
                  onChange={() => handleGamesChange(game)}
                  className="w-4 h-4 accent-furia-gold"
                />
                <label htmlFor={`game-${game}`} className="ml-2 text-sm">
                  {game}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Jogadores Favoritos da FURIA
          </label>
          <TagInput
            tags={favoritePlayers}
            onAddTag={handleAddPlayer}
            onRemoveTag={handleRemovePlayer}
            placeholder="Digite ou selecione jogadores..."
            suggestions={playerOptions}
          />
        </div>
        
        <div>
          <label htmlFor="streamer" className="block text-sm font-medium mb-1">
            Streamers Favoritos da FURIA
          </label>
          <TagInput
            tags={favoriteStreamers}
            onAddTag={handleAddStreamer}
            onRemoveTag={handleRemoveStreamer}
            placeholder="Digite o nome do streamer e pressione Enter..."
          />
        </div>
        
        <div>
          <label htmlFor="gender" className="block text-sm font-medium mb-1">
            Gênero (opcional)
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="furia-input w-full"
          >
            <option value="">Prefiro não informar</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="nao-binario">Não-binário</option>
            <option value="outro">Outro</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Links de Redes Sociais
          </label>
          {socialLinks.map((link, index) => (
            <div key={index} className="mb-2">
              <input
                type="url"
                value={link}
                onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                placeholder="https://..."
                className="furia-input w-full"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addSocialLink}
            className="text-sm text-furia-gold hover:underline"
          >
            + Adicionar outro link
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload de Documento
          </label>
          <div className="border border-dashed border-furia-gold/50 rounded-md p-4 text-center">
            <input
              type="file"
              id="document"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="document"
              className="cursor-pointer flex flex-col items-center"
            >
              <span className="text-sm text-gray-300 mb-2">
                Clique para selecionar um documento
              </span>
              {document && (
                <span className="text-sm text-furia-gold">
                  {document.name}
                </span>
              )}
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          className="furia-button w-full"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
