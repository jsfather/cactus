import { ApiService } from '@/app/lib/api/client';

export interface HomeSettings {
  id: number;
  phone: string;
  email: string;
  address: string;
  about_us: string;
  our_mission: string;
  our_vision: string;
  footer_text: string;
}

export const homeSettingsService = {
  get: async (): Promise<HomeSettings> => {
    const res = await ApiService.get<{ data: HomeSettings }>('home/settings');
    return res.data;
  },
  update: async (data: Omit<HomeSettings, 'id'>): Promise<HomeSettings> => {
    const res = await ApiService.post<{ data: HomeSettings }>('admin/settings', data);
    return res.data;
  },
};
