export interface Level {
  id: number;
  name: string;
  label: string;
}

export interface GetLevelListResponse {
  data: Level[];
}
