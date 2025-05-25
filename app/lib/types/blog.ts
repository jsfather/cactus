export interface Blog {
  id: string;
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
