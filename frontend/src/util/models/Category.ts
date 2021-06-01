import { Timestampable } from "./Timestampable";

export interface Category extends Timestampable {
  readonly id: string;
  name: string;
  description: string;
  is_active: boolean;
}