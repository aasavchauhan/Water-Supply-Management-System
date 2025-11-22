import type { Farmer, SupplyEntry, Payment, Settings } from '../types';

interface SyncQueueItem {
  id: string;
  entityType: 'farmer' | 'supply' | 'payment' | 'settings';
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  synced: boolean;
  retryCount: number;
}

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'WaterSupplyDB';
  private readonly DB_VERSION = 2;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('farmers')) {
          const farmersStore = db.createObjectStore('farmers', { keyPath: 'id' });
          farmersStore.createIndex('userId', 'userId', { unique: false });
          farmersStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('supplyEntries')) {
          const suppliesStore = db.createObjectStore('supplyEntries', { keyPath: 'id' });
          suppliesStore.createIndex('userId', 'userId', { unique: false });
          suppliesStore.createIndex('farmerId', 'farmerId', { unique: false });
          suppliesStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('payments')) {
          const paymentsStore = db.createObjectStore('payments', { keyPath: 'id' });
          paymentsStore.createIndex('userId', 'userId', { unique: false });
          paymentsStore.createIndex('farmerId', 'farmerId', { unique: false });
          paymentsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'userId' });
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('synced', 'synced', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  // Farmers
  async getAllFarmers(): Promise<Farmer[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['farmers'], 'readonly');
      const store = transaction.objectStore('farmers');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveFarmer(farmer: Farmer): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['farmers'], 'readwrite');
      const store = transaction.objectStore('farmers');
      const request = store.put(farmer);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFarmer(id: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['farmers'], 'readwrite');
      const store = transaction.objectStore('farmers');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Supply Entries
  async getAllSupplyEntries(): Promise<SupplyEntry[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['supplyEntries'], 'readonly');
      const store = transaction.objectStore('supplyEntries');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveSupplyEntry(entry: SupplyEntry): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['supplyEntries'], 'readwrite');
      const store = transaction.objectStore('supplyEntries');
      const request = store.put(entry);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Payments
  async getAllPayments(): Promise<Payment[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['payments'], 'readonly');
      const store = transaction.objectStore('payments');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async savePayment(payment: Payment): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['payments'], 'readwrite');
      const store = transaction.objectStore('payments');
      const request = store.put(payment);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Settings
  async getSettings(userId: string): Promise<Settings | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveSettings(settings: Settings): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put(settings);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Sync Queue Management
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'synced' | 'retryCount'>): Promise<void> {
    if (!this.db) await this.init();
    const queueItem: SyncQueueItem = {
      ...item,
      id: `sync_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      synced: false,
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.put(queueItem);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingSyncItems(): Promise<SyncQueueItem[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const index = store.index('synced');
      const request = index.getAll(0); // 0 = not synced, 1 = synced

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async markSyncItemCompleted(id: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.synced = true;
          store.put(item);
          resolve();
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async incrementSyncRetry(id: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.retryCount += 1;
          store.put(item);
          resolve();
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async clearCompletedSyncItems(): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const index = store.index('synced');
      const request = index.openCursor(IDBKeyRange.only(true));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Metadata (for tracking last sync times, etc.)
  async getMetadata(key: string): Promise<any> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['metadata'], 'readonly');
      const store = transaction.objectStore('metadata');
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveMetadata(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['metadata'], 'readwrite');
      const store = transaction.objectStore('metadata');
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Bulk operations for initial sync
  async bulkSaveFarmers(farmers: Farmer[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['farmers'], 'readwrite');
      const store = transaction.objectStore('farmers');

      farmers.forEach(farmer => store.put(farmer));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async bulkSaveSupplyEntries(entries: SupplyEntry[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['supplyEntries'], 'readwrite');
      const store = transaction.objectStore('supplyEntries');

      entries.forEach(entry => store.put(entry));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async bulkSavePayments(payments: Payment[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['payments'], 'readwrite');
      const store = transaction.objectStore('payments');

      payments.forEach(payment => store.put(payment));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ['farmers', 'supplyEntries', 'payments', 'settings', 'syncQueue', 'metadata'],
        'readwrite'
      );

      transaction.objectStore('farmers').clear();
      transaction.objectStore('supplyEntries').clear();
      transaction.objectStore('payments').clear();
      transaction.objectStore('settings').clear();
      transaction.objectStore('syncQueue').clear();
      transaction.objectStore('metadata').clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const indexedDBService = new IndexedDBService();
export type { SyncQueueItem };
