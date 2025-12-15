// src/types/storage.d.ts

interface StorageResult {
  key: string;
  value: string;
  shared?: boolean;
}

interface StorageListResult {
  keys: string[];
  prefix?: string;
  shared?: boolean;
}

interface StorageDeleteResult {
  key: string;
  deleted: boolean;
  shared?: boolean;
}

interface Storage {
  get(key: string, shared?: boolean): Promise<StorageResult | null>;
  set(key: string, value: string, shared?: boolean): Promise<StorageResult | null>;
  delete(key: string, shared?: boolean): Promise<StorageDeleteResult | null>;
  list(prefix?: string, shared?: boolean): Promise<StorageListResult | null>;
}

interface Window {
  storage: Storage;
}

declare global {
  interface Window {
    storage: Storage;
  }
}