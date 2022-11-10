export interface Certification {
  date: string;
  category: Category;
  image: string;
  id: string;
}

export type Category = 'career' | 'edteam' | 'platzi' | 'udemy';
