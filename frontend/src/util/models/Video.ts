import { Category } from "./Category";
import { Genre } from "./Genre";
import { Timestampable } from "./Timestampable";

interface GenreVideo extends Omit<Genre, 'categories'> {}

export interface Video extends Timestampable {
  readonly id: string;
  title: string;
  description: string;
  year_launched: number;
  opened: boolean;
  rating: string;
  duration: number;
  genres: GenreVideo[];
  categories: Category[];
  thumb_file_url: string;
  banner_file_url: string;
  trailer_file_url: string;
  video_file_url: string;
}

export const VideoFileFieldsMap = {
  'thumb_file': "Thumbnail",
  'banner_file': 'Banner',
  'trailer_file': 'Trailer',
  'video_file': 'Principal'
};