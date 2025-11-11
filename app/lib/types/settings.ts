export interface Settings {
  id: number;
  phone: string;
  email: string;
  address: string;
  about_us: string;
  our_mission: string;
  our_vision: string;
  footer_text: string;
}

export interface GetSettingsResponse {
  data: Settings;
}
