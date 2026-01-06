
export interface ListingData {
  title: string;
  description: string;
  tags: string[];
}

export interface TrendNiche {
  title: string;
  demand: 'High' | 'Medium' | 'Low';
  growth: string;
  icon: string;
}

export interface GeneratedImage {
  url: string;
  aspectRatio: string;
  size: string;
}

export enum Page {
  Dashboard = 'dashboard',
  TrendSpy = 'trend_spy',
  ListingGenerator = 'listing_generator',
  MockupStudio = 'mockup_studio',
  Settings = 'settings'
}
