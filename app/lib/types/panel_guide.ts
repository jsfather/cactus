export interface PanelGuide {
  id: number | string;
  type: 'student' | 'admin' | 'teacher';
  title: string;
  description: string;
  file: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
