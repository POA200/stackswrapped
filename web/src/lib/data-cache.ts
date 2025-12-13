// Data cache for wrapped data to avoid refetching
interface WrappedData {
  volumeData: any;
  wrappedData: any;
  timestamp: number;
}

class DataCache {
  private cache = new Map<string, WrappedData>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  set(address: string, volumeData: any, wrappedData: any) {
    this.cache.set(address, {
      volumeData,
      wrappedData,
      timestamp: Date.now(),
    });
  }

  get(address: string): WrappedData | null {
    const cached = this.cache.get(address);
    if (!cached) return null;

    // Check if cache is still valid
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(address);
      return null;
    }

    return cached;
  }

  clear(address: string) {
    this.cache.delete(address);
  }

  clearAll() {
    this.cache.clear();
  }
}

export const dataCache = new DataCache();
