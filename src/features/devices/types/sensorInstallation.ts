export interface SensorInstallation {
  id: number;
  waterMeterId: number;
  sensorId: number;
  observation: string;
  previousRemovalReason: string;
  installationDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  waterMeter?: any;
  sensor?: any;
}

export interface SensorInstallationFormValues {
  waterMeterId: string;
  sensorId: string;
  observation: string;
  previousRemovalReason: string;
}

export interface SensorInstallationRequest {
  waterMeterId: number;
  sensorId: number;
  observation: string;
  previousRemovalReason: string;
}

export type RemovalReason = 'FAILURE' | 'MAINTENANCE' | 'UPGRADE' | 'OTHER' | 'NONE';