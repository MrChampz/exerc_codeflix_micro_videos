import { Category } from "./Category";
import { Timestampable } from "./Timestampable";

export interface Genre extends Timestampable {
  readonly id: string;
  name: string;
  is_active: boolean;
  categories: Category[];
}