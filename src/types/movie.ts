export interface MovieBasicInfo {
  id: string;
  title: string;
  genres: string[];
  poster: string;
}

export interface Movie extends MovieBasicInfo {
  description: string;
}
