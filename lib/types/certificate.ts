export interface Certificate {
  id: number;
  image: string;
  title: string;
  description: string;
  issued_at: string;
  organization: string;
  location: string;
  categories: string[];
  created_at: string;
  updated_at: string;
}

export interface CertificateCreateRequest {
  image: File | string;
  title: string;
  description: string;
  issued_at: string;
  organization: string;
  location: string;
  categories: string[];
}

export interface CertificateUpdateRequest {
  image?: File | string;
  title: string;
  description: string;
  issued_at: string;
  organization: string;
  location: string;
  categories: string[];
}

export interface CertificateResponse {
  data: Certificate;
}

export interface CertificateListResponse {
  data: Certificate[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
