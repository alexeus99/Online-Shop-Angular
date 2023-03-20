export interface IProducts {
  id?: number;
  title: string;
  price: number;
  year: string;
  image?: string;
  
  configure: IProcutsConfig;
}

export interface IProcutsConfig {
  chip: string;
  ssd: string;
  memory: string;
  display: string;
}
