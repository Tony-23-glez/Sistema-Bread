// src/types/index.ts

export type ProductType = 'punta' | 'chato' | 'telera' | 'grande';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  icon: string;
}

export interface ProductionEntry {
  id: string;
  date: string;
  products: {
    [key in ProductType]: number;
  };
  notes?: string;
  createdAt: string;
}

export interface SalesEntry {
  id: string;
  date: string;
  products: {
    [key in ProductType]: number;
  };
  notes?: string;
  createdAt: string;
}

export interface StockData {
  type: ProductType;
  name: string;
  production: number;
  sales: number;
  current: number;
  icon: string;
}

export interface ChartData {
  date: string;
  punta: number;
  chato: number;
  telera: number;
  grande: number;
}

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Bolillo de Punta', type: 'punta', icon: '🥖' },
  { id: '2', name: 'Bolillo Chato', type: 'chato', icon: '🥐' },
  { id: '3', name: 'Telera', type: 'telera', icon: '🫓' },
  { id: '4', name: 'Bolillo Grande', type: 'grande', icon: '🥯' },
];