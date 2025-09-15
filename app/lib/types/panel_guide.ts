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

export interface GetPanelGuideListResponse {
  data: PanelGuide[];
}

export interface GetPanelGuideResponse {
  data: PanelGuide;
}

export interface CreatePanelGuideRequest {
  title: string;
  description: string;
  type: 'student' | 'admin' | 'teacher';
  file?: File;
}

export interface UpdatePanelGuideRequest {
  title?: string;
  description?: string;
  type?: 'student' | 'admin' | 'teacher';
  file?: File;
}
