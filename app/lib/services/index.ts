export { settingsService, SettingsService } from './settings.service';

// Service container (optional)
export const services = {
  settings: settingsService,
} as const;