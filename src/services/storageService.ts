
// Simulating a storage service for profile data and file uploads
// In a real app, this would interact with Firebase/Supabase or other BaaS

type FanProfile = {
  userId: string;
  name: string;
  favoriteGames: string[];
  favoritePlayers: string[];
  favoriteStreamers: string[]; // Changed from favoriteStreamer string to favoriteStreamers string[]
  gender?: string;
  socialLinks: string[];
  documentUploaded?: string;
  profilePicture?: string; // Added profile picture URL
};

// In-memory storage for this demo
const profiles: Record<string, FanProfile> = {};
const uploads: Record<string, string> = {};

export const saveProfile = async (profile: FanProfile): Promise<void> => {
  // Save profile to storage
  profiles[profile.userId] = profile;
  console.log("Profile saved:", profile);
  return Promise.resolve();
};

export const getProfile = async (userId: string): Promise<FanProfile | null> => {
  // Fetch profile from storage
  return profiles[userId] || null;
};

export const uploadDocument = async (userId: string, file: File): Promise<string> => {
  // Simulate file upload
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileKey = `document-${userId}-${Date.now()}`;
      uploads[fileKey] = file.name;
      resolve(fileKey);
    };
    reader.readAsDataURL(file);
  });
};

export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
  // Simulate profile picture upload
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const fileKey = `profile-${userId}-${Date.now()}`;
      uploads[fileKey] = dataUrl; // Store the data URL instead of just the filename
      resolve(fileKey);
    };
    reader.readAsDataURL(file);
  });
};

export const getDocumentName = (fileKey: string): string => {
  return uploads[fileKey] || "Documento não encontrado";
};

export const getProfilePictureUrl = (fileKey: string): string => {
  return uploads[fileKey] || "";
};

export const getAllProfiles = (): FanProfile[] => {
  return Object.values(profiles);
};
