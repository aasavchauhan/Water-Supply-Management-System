import { apiService } from './api.service';
import { indexedDBService, type SyncQueueItem } from './indexeddb.service';
import type { Farmer, SupplyEntry, Payment, Settings } from '../types';

type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

class SyncService {
  private isOnline: boolean = navigator.onLine;
  private syncStatus: SyncStatus = 'idle';
  private syncInterval: number | null = null;
  private listeners: Set<(status: SyncStatus, pendingCount: number) => void> = new Set();

  constructor() {
    this.setupOnlineListeners();
    this.startAutoSync();
  }

  private setupOnlineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateStatus('idle');
      this.syncToRemote(); // Sync immediately when coming back online
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateStatus('offline');
    });
  }

  private startAutoSync() {
    // Auto-sync every 30 seconds when online
    this.syncInterval = window.setInterval(() => {
      if (this.isOnline && this.syncStatus !== 'syncing') {
        this.syncToRemote();
      }
    }, 30000);
  }

  private updateStatus(status: SyncStatus) {
    this.syncStatus = status;
    this.notifyListeners();
  }

  private async notifyListeners() {
    const pendingCount = (await indexedDBService.getPendingSyncItems()).length;
    this.listeners.forEach(listener => listener(this.syncStatus, pendingCount));
  }

  public onStatusChange(listener: (status: SyncStatus, pendingCount: number) => void) {
    this.listeners.add(listener);
    this.notifyListeners(); // Notify immediately with current status
    return () => this.listeners.delete(listener);
  }

  public getStatus(): SyncStatus {
    return this.syncStatus;
  }

  public isOffline(): boolean {
    return !this.isOnline;
  }

  // Initial sync: Pull data from Neon to local IndexedDB
  async syncFromRemote(userId: string): Promise<void> {
    if (!this.isOnline) {
      console.log('[Sync] Offline - skipping remote sync');
      return;
    }

    try {
      console.log('[Sync] Pulling data from Neon DB...');
      this.updateStatus('syncing');

      const [farmers, supplies, payments, settings] = await Promise.all([
        apiService.getFarmers(),
        apiService.getSupplyEntries(),
        apiService.getPayments(),
        apiService.getSettings(),
      ]);

      await Promise.all([
        indexedDBService.bulkSaveFarmers(farmers),
        indexedDBService.bulkSaveSupplyEntries(supplies),
        indexedDBService.bulkSavePayments(payments),
        settings ? indexedDBService.saveSettings(settings) : Promise.resolve(),
      ]);

      await indexedDBService.saveMetadata('lastSyncFromRemote', Date.now());
      console.log('[Sync] Successfully synced from Neon DB');
      this.updateStatus('idle');
    } catch (error) {
      console.error('[Sync] Error syncing from remote:', error);
      this.updateStatus('error');
      throw error;
    }
  }

  // Background sync: Push local changes to Neon
  async syncToRemote(): Promise<void> {
    if (!this.isOnline) {
      console.log('[Sync] Offline - queuing changes for later');
      return;
    }

    if (this.syncStatus === 'syncing') {
      return; // Already syncing
    }

    try {
      const pendingItems = await indexedDBService.getPendingSyncItems();
      
      if (pendingItems.length === 0) {
        return; // Nothing to sync
      }

      console.log(`[Sync] Syncing ${pendingItems.length} pending items to Neon DB...`);
      this.updateStatus('syncing');

      for (const item of pendingItems) {
        try {
          await this.syncSingleItem(item);
          await indexedDBService.markSyncItemCompleted(item.id);
        } catch (error) {
          console.error(`[Sync] Failed to sync item ${item.id}:`, error);
          await indexedDBService.incrementSyncRetry(item.id);
          
          // Stop syncing if we hit max retries
          if (item.retryCount >= 5) {
            console.error(`[Sync] Item ${item.id} exceeded max retries`);
            await indexedDBService.markSyncItemCompleted(item.id); // Mark as completed to skip it
          }
        }
      }

      // Clean up completed items older than 1 hour
      await indexedDBService.clearCompletedSyncItems();
      await indexedDBService.saveMetadata('lastSyncToRemote', Date.now());
      
      console.log('[Sync] Successfully synced to Neon DB');
      this.updateStatus('idle');
    } catch (error) {
      console.error('[Sync] Error syncing to remote:', error);
      this.updateStatus('error');
    }
  }

  private async syncSingleItem(item: SyncQueueItem): Promise<void> {
    const { entityType, operation, data } = item;

    switch (entityType) {
      case 'farmer':
        if (operation === 'create') {
          // Check if already exists on server (idempotency)
          try {
            await apiService.getFarmerById(data.id);
            // Already exists, skip
            return;
          } catch {
            // Doesn't exist, create it
            await apiService.createFarmer(data);
          }
        } else if (operation === 'update') {
          await apiService.updateFarmer(data.id, data);
        } else if (operation === 'delete') {
          await apiService.deleteFarmer(data.id);
        }
        break;

      case 'supply':
        if (operation === 'create') {
          try {
            // For supplies, we can't easily check existence, so just try to create
            await apiService.createSupplyEntry(data);
          } catch (error: any) {
            // If it's a duplicate error, ignore it
            if (!error?.message?.includes('duplicate')) {
              throw error;
            }
          }
        }
        break;

      case 'payment':
        if (operation === 'create') {
          try {
            await apiService.createPayment(data);
          } catch (error: any) {
            if (!error?.message?.includes('duplicate')) {
              throw error;
            }
          }
        }
        break;

      case 'settings':
        if (operation === 'update') {
          await apiService.updateSettings(data);
        }
        break;
    }
  }

  // Optimistic write: Save to local first, then queue for remote sync
  async optimisticWrite<T>(
    entityType: 'farmer' | 'supply' | 'payment' | 'settings',
    operation: 'create' | 'update' | 'delete',
    data: T,
    localSaveFn: () => Promise<void>
  ): Promise<void> {
    // 1. Save to local immediately (fast, works offline)
    await localSaveFn();

    // 2. Queue for background sync to Neon
    await indexedDBService.addToSyncQueue({
      entityType,
      operation,
      data,
    });

    // 3. Try to sync immediately if online
    if (this.isOnline) {
      this.syncToRemote().catch(err => 
        console.error('[Sync] Background sync failed:', err)
      );
    }
  }

  // Force sync now
  async forceSyncNow(): Promise<void> {
    await this.syncToRemote();
  }

  // Get pending sync count
  async getPendingSyncCount(): Promise<number> {
    const items = await indexedDBService.getPendingSyncItems();
    return items.length;
  }

  // Clear all local data and resync from remote
  async resetAndResync(userId: string): Promise<void> {
    await indexedDBService.clearAllData();
    await this.syncFromRemote(userId);
  }

  public destroy() {
    if (this.syncInterval !== null) {
      clearInterval(this.syncInterval);
    }
    this.listeners.clear();
  }
}

export const syncService = new SyncService();
export type { SyncStatus };
