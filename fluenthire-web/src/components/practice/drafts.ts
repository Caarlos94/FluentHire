export function saveDraft(key: string, data: Record<string, string>) {
  try {
    localStorage.setItem(`fluenthire-draft-${key}`, JSON.stringify(data));
  } catch { /* quota exceeded — ignore */ }
}

export function loadDraft(key: string): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(`fluenthire-draft-${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft(key: string) {
  try {
    localStorage.removeItem(`fluenthire-draft-${key}`);
  } catch { /* ignore */ }
}
