import { useEffect, useState } from 'react';
import { syncService, type SyncStatus as SyncStatusType } from '../services/sync.service';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export function SyncStatus() {
  const [status, setStatus] = useState<SyncStatusType>('idle');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const unsubscribe = syncService.onStatusChange((newStatus, count) => {
      setStatus(newStatus);
      setPendingCount(count);
    });

    return () => unsubscribe();
  }, []);

  const handleForceSync = async () => {
    try {
      toast.info('Syncing data...');
      await syncService.forceSyncNow();
      toast.success('Data synced successfully');
    } catch (error) {
      toast.error('Sync failed. Will retry automatically.');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'offline':
        return <WifiOff className="h-4 w-4 text-orange-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'idle':
        return pendingCount > 0 
          ? <CloudOff className="h-4 w-4 text-yellow-500" />
          : <Cloud className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'offline':
        return pendingCount > 0 
          ? `Offline - ${pendingCount} pending`
          : 'Offline';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync error';
      case 'idle':
        return pendingCount > 0 
          ? `${pendingCount} pending`
          : 'Synced';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'offline':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'syncing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'idle':
        return pendingCount > 0
          ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
          : 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="font-medium">{getStatusText()}</span>
      
      {(status === 'idle' || status === 'error') && pendingCount > 0 && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleForceSync}
          className="h-6 px-2 ml-1"
          disabled={status === 'syncing'}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
