export interface Timestampable {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}