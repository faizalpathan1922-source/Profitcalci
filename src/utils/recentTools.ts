/**
 * Helper to manage Recently Used tools in localStorage
 * Stores the last 3 tool slugs the user navigated to.
 */

const RECENT_TOOLS_STORAGE_KEY = 'profitcalci_recent_tools';
const MAX_RECENT_TOOLS = 3;

export function getRecentlyUsedToolSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_TOOLS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string').slice(0, MAX_RECENT_TOOLS);
    }
  } catch {
    // ignore parse error or disabled storage
  }
  return [];
}

export function recordRecentlyUsedTool(slug: string): void {
  if (typeof window === 'undefined' || !slug) return;
  try {
    const existing = getRecentlyUsedToolSlugs();
    // Remove if already present so it moves to front (most recent)
    const updated = [slug, ...existing.filter((s) => s !== slug)].slice(0, MAX_RECENT_TOOLS);
    localStorage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(updated));
    // Dispatch storage/custom event so same-tab or other components update immediately if needed
    window.dispatchEvent(new CustomEvent('profitcalci_recent_tools_updated', { detail: updated }));
  } catch {
    // ignore storage error
  }
}

export function clearRecentlyUsedTools(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_TOOLS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('profitcalci_recent_tools_updated', { detail: [] }));
  } catch {
    // ignore storage error
  }
}
