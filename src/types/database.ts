export type KadesProfile = {
  id: number;
  full_name: string;
  title: string | null;
  period: string;
  photo_url: string | null;
  welcome_speech: string | null;
  updated_at: string;
};

export type PriorityProgram = {
  id: string;
  sort_order: number;
  title: string;
  description: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PopulationStats = {
  id: string;
  year: number;
  total_population: number;
  total_male: number;
  total_female: number;
  total_families: number;
  total_rw: number;
  total_rt: number;
  notes: string | null;
  is_current: boolean;
  recorded_at: string;
};

export type AgeDistribution = {
  id: string;
  stats_id: string;
  age_group: string;
  male_count: number;
  female_count: number;
};

export type OccupationDistribution = {
  id: string;
  stats_id: string;
  occupation: string;
  count: number;
};

export type EducationDistribution = {
  id: string;
  stats_id: string;
  level: string;
  count: number;
};

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  category: string;
  is_published: boolean;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type VillageService = {
  id: string;
  sort_order: number;
  title: string;
  description: string | null;
  icon: string | null;
  requirements: string | null;
  is_active: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};