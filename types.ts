export interface MPProfile {
  name: string;
  party: string;
  constituency: string;
  education: {
    secondary: string;
    university: string;
    schoolType: 'Private' | 'Grammar' | 'State' | 'Unknown';
  };
  previousJobs: string[];
  poshScore: number; // 0-100
  poshAnalysis: string;
  netWorthEstimate?: string;
}

export interface PartyStats {
  partyName: string;
  privateSchoolPercent: number;
  oxbridgePercent: number;
  avgPoshScore: number;
  color: string;
}

export interface RegionStats {
  id: string;
  name: string;
  avgPoshScore: number;
  privateSchoolPercent: number;
  notableConstituency: string;
}

export interface NotableMP {
  name: string;
  party: string;
  poshScore: number;
  reason: string;
}

export interface GlobalStats {
  parties: PartyStats[];
  regions: RegionStats[];
  totalPrivateSchool: number;
  totalOxbridge: number;
  summary: string;
  notableMPs: NotableMP[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}