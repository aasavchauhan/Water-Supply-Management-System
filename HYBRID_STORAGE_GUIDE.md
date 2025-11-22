# Hybrid Storage System Guide

## Overview

Your Water Supply Management System now uses a **hybrid offline-first architecture** with:
- **IndexedDB** for local storage (instant, works offline)
- **Neon PostgreSQL** as cloud backup (syncs in background)
- **Automatic synchronization** between local and remote

## How It Works

### 📝 Writing Data (Create/Update/Delete)

When you perform any action (add farmer, record supply, etc.):

1. **Instant Local Save** (0ms delay)
   - Data saves to IndexedDB immediately
   - UI updates instantly (no loading spinner)
   - Works even when offline

2. **Background Sync** (happens automatically)
   - Operation queued for upload to Neon
   - Syncs when internet available
   - Retries automatically on failure (max 5 times)

**Example Flow:**
```
User clicks "Add Farmer"
  ↓
Save to IndexedDB (instant) ✓
  ↓
Update UI (instant) ✓
  ↓
Queue for sync to Neon ⏳
  ↓
[Background] Upload to Neon when online ✓
```

### 📖 Reading Data (Load on App Start)

When you open the app or refresh:

1. **Load from Local First** (fast)
   - IndexedDB returns data immediately
   - UI displays right away

2. **Sync from Neon** (background)
   - Fetches latest data from cloud
   - Updates UI if anything changed
   - Ensures you have latest data from other devices

**Example Flow:**
```
App opens
  ↓
Load from IndexedDB (instant) ✓
  ↓
Display data to user ✓
  ↓
[Background] Fetch from Neon when online
  ↓
Update UI if remote data differs
```

## Visual Sync Status

Look for the **Sync Status** indicator in the header:

### Status Icons:
- 🟢 **Green Cloud** - All synced, online
- 🟡 **Yellow Cloud** - Pending uploads (X items waiting)
- 🔵 **Blue Spinner** - Currently syncing...
- 🟠 **Orange WiFi Off** - Offline mode
- 🔴 **Red Alert** - Sync error (will retry)

### Click the Sync Status to:
- See how many items are pending
- Force an immediate sync
- Check online/offline status

## Offline Mode

### What Works Offline:
✅ Add/edit/delete farmers
✅ Record supply entries
✅ Record payments
✅ View all data
✅ Generate reports
✅ All UI features

### What Happens:
- All changes save locally
- Queued for sync when online
- Visual indicator shows pending count
- Automatic sync when reconnected

### When Back Online:
- Automatic sync starts within 30 seconds
- Or click sync button to force immediate sync
- Pending changes upload to Neon
- UI shows sync progress

## Benefits

### ⚡ Performance
- **Instant UI updates** (no waiting for server)
- **Works offline** (no internet = no problem)
- **Fast app loading** (local data loads first)

### 🔄 Reliability
- **Automatic retry** (failed syncs retry up to 5 times)
- **No data loss** (local copy always safe)
- **Background sync** (never blocks UI)

### 🌐 Multi-Device Support
- **Cloud backup** (Neon is source of truth)
- **Sync across devices** (login from anywhere)
- **Conflict resolution** (last-write-wins)

## Technical Details

### Data Stores (IndexedDB)

6 object stores in local browser database:

1. **farmers** - Farmer profiles with balances
2. **supplyEntries** - Water delivery records
3. **payments** - Payment transactions
4. **settings** - User preferences
5. **syncQueue** - Pending operations to upload
6. **metadata** - Last sync timestamps, etc.

### Sync Queue

Every write operation creates a queue item:

```typescript
{
  id: "sync_1732234567890_0.123",
  entityType: "farmer", // or "supply", "payment", "settings"
  operation: "create",  // or "update", "delete"
  data: { /* full entity data */ },
  timestamp: 1732234567890,
  synced: false,
  retryCount: 0
}
```

### Automatic Sync

- **Interval**: Every 30 seconds (when online)
- **Trigger**: Immediately after writes (if online)
- **Retry**: Up to 5 attempts with exponential backoff
- **Cleanup**: Removes completed items after 1 hour

### Conflict Resolution

**Strategy**: Last-write-wins (based on `updated_at` timestamp)

- Local and remote changes both have timestamps
- Newer timestamp wins during sync
- Both IndexedDB and Neon updated to match

## Monitoring & Debugging

### Check Sync Status
1. Look at header sync indicator
2. Shows pending count in real-time
3. Click to force sync or see details

### Browser DevTools

**IndexedDB Inspector:**
1. Open DevTools (F12)
2. Go to "Application" tab
3. Expand "IndexedDB" → "WaterSupplyDB"
4. View farmers, syncQueue, etc.

**Console Logs:**
- `[Sync] Pulling data from Neon DB...`
- `[Sync] Syncing 3 pending items to Neon DB...`
- `[Sync] Successfully synced to Neon DB`

### Network Tab
- Watch API calls to http://localhost:3001/api/*
- Background syncs appear as POST/PUT/DELETE requests
- Check if syncs failing due to network errors

## Common Scenarios

### Scenario 1: Add Farmer While Offline
```
1. User: Clicks "Add Farmer" (WiFi off)
2. System: Saves to IndexedDB immediately
3. UI: Farmer appears in list instantly
4. Sync: Shows "Offline - 1 pending"
5. [Later] WiFi reconnects
6. Sync: Auto-uploads farmer to Neon
7. UI: Shows "Synced" (green)
```

### Scenario 2: Multi-Device Sync
```
Device A: Adds farmer "John" → syncs to Neon
Device B: Opens app → pulls from Neon → sees "John"
Device B: Adds payment for "John" → syncs to Neon
Device A: Background sync → pulls payment → updates balance
```

### Scenario 3: Sync Failure Recovery
```
1. Write operation queued
2. Sync attempt fails (server down)
3. Retry count increments (1/5)
4. Wait 30 seconds, retry
5. Continues until success or 5 failures
6. User sees "Sync error" status
7. Can manually force retry via UI
```

## Best Practices

### For Users:
1. **Check sync status** before closing app
2. **Wait for "Synced"** on important changes
3. **Use Force Sync** if needed before logout
4. **Monitor pending count** when offline

### For Developers:
1. **Always use DataContext** methods (don't call API directly)
2. **Trust optimistic updates** (UI updates before sync)
3. **Handle offline gracefully** (all features work offline)
4. **Monitor sync service** logs in console
5. **Test offline mode** regularly (DevTools → Network → Offline)

## Troubleshooting

### Problem: Sync stuck at "X pending"

**Solution:**
1. Check browser console for errors
2. Verify Neon DB connection (backend logs)
3. Click sync button to force retry
4. Check Network tab for failed requests

### Problem: Data missing after refresh

**Solution:**
1. Check if sync completed before refresh
2. Verify IndexedDB has data (DevTools → Application)
3. Check if user authenticated (JWT token valid)
4. Look for sync errors in console

### Problem: "Sync error" showing

**Solution:**
1. Check internet connection
2. Verify backend server running (http://localhost:3001/health)
3. Check Neon DB credentials in .env
4. Look at console logs for specific error
5. Wait for auto-retry or click Force Sync

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    USER ACTIONS                     │
│         (Add Farmer, Record Supply, etc.)           │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│                 DataContext                         │
│  (React State Management + Hybrid Storage Logic)    │
└─────────┬───────────────────────────┬───────────────┘
          │                           │
          ↓                           ↓
┌──────────────────────┐    ┌──────────────────────┐
│   IndexedDB Service  │    │   Sync Service       │
│   (Local Storage)    │    │   (Queue Manager)    │
│                      │    │                      │
│  • Instant writes    │    │  • Online detection  │
│  • Fast reads        │    │  • Auto-sync (30s)   │
│  • 6 object stores   │    │  • Retry logic       │
└──────────────────────┘    └─────────┬────────────┘
          │                           │
          │                           ↓
          │                  ┌──────────────────────┐
          │                  │   API Service        │
          │                  │   (HTTP Client)      │
          │                  └─────────┬────────────┘
          │                           │
          │                           ↓
          │                  ┌──────────────────────┐
          └─────────────────▶│   Neon PostgreSQL    │
                             │   (Cloud DB)         │
                             │                      │
                             │  • Source of truth   │
                             │  • Multi-user sync   │
                             │  • Backup & recovery │
                             └──────────────────────┘
```

## Summary

Your app now has **Netflix-level offline support**:
- Works instantly even with slow/no internet
- Automatically syncs when connection available
- Never lose data (local + cloud backup)
- Visual feedback on sync status
- Handles conflicts intelligently

Just use the app normally - the hybrid system handles all sync complexity automatically! 🚀
