export interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  duration: number; // in seconds
  previewUrl: string;
}

export interface ProfileData {
  username: string;
  uid: string;
  bio: string;
  location?: string;
  avatarUrl: string;
  backgroundUrl: string;
  discord: {
    label: string;
    userId: string;
    url: string;
    username: string;
  };
  roblox: {
    label: string;
    userId: string;
    url: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  iosCert?: {
    label: string;
    description: string;
    price: string;
    url: string;
  };
  music: Track;
  views: number;
}
