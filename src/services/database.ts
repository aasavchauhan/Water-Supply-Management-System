import { Farmer, SupplyEntry, Payment, Settings } from '../types';

const DB_NAME = 'WaterSupplyDB';
const DB_VERSION = 1;

export class DatabaseService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('farmers')) {
          db.createObjectStore('farmers', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('supplyEntries')) {
          db.createObjectStore('supplyEntries', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('payments')) {
          db.createObjectStore('payments', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      };
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // Farmers
  async getAllFarmers(): Promise<Farmer[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('farmers');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveFarmer(farmer: Farmer): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('farmers', 'readwrite');
      const request = store.put(farmer);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFarmer(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('farmers', 'readwrite');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Supply Entries
  async getAllSupplyEntries(): Promise<SupplyEntry[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('supplyEntries');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveSupplyEntry(entry: SupplyEntry): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('supplyEntries', 'readwrite');
      const request = store.put(entry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Payments
  async getAllPayments(): Promise<Payment[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('payments');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async savePayment(payment: Payment): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('payments', 'readwrite');
      const request = store.put(payment);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Settings
  async getSettings(): Promise<Settings | null> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('settings');
      const request = store.get('app-settings');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveSettings(settings: Settings): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('settings', 'readwrite');
      const request = store.put({ ...settings, id: 'app-settings' });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Bulk save operations
  async saveFarmers(farmers: Farmer[]): Promise<void> {
    const store = this.getStore('farmers', 'readwrite');
    for (const farmer of farmers) {
      store.put(farmer);
    }
  }

  async saveSupplyEntries(entries: SupplyEntry[]): Promise<void> {
    const store = this.getStore('supplyEntries', 'readwrite');
    for (const entry of entries) {
      store.put(entry);
    }
  }

  async savePayments(payments: Payment[]): Promise<void> {
    const store = this.getStore('payments', 'readwrite');
    for (const payment of payments) {
      store.put(payment);
    }
  }
}

export const db = new DatabaseService();
