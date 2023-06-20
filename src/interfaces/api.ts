export interface ChuckNorrisJoke {
  categories: string[];
  created_at: string;
  icon_url: string;
  id: string;
  updated_at: string;
  url: string;
  value: string;
}

export interface QuoteType {
  text: string;
  author: string;
  createdAt: Date;
}
