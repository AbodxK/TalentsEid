const STORAGE_KEY = "talentseid-download-stats";

export interface DownloadStats {
  [designId: string]: number;
}

export function getDownloadStats(): DownloadStats {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function incrementDownload(designId: string): DownloadStats {
  const stats = getDownloadStats();
  stats[designId] = (stats[designId] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  return stats;
}

export function getDesignDownloadCount(designId: string): number {
  const stats = getDownloadStats();
  return stats[designId] || 0;
}

export function getTotalDownloads(): number {
  const stats = getDownloadStats();
  return Object.values(stats).reduce((sum, count) => sum + count, 0);
}
