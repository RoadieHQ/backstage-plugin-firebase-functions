export type FunctionData = {
  name: string;
  urlTrigger: string;
  status: string;
  runtime: string;
  availableMemoryMb: number;
  updateTime: string;
  region: string;
  project: string;
  envVariables: Record<string, string>;
  labels: Record<string, string>;
};
