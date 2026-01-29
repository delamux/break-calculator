import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageAdapter } from '../../infrastructure/adapters/LocalStorageAdapter';

describe('The LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    adapter = new LocalStorageAdapter();
    localStorage.clear();
  });

  it('stores and retrieves an item', async () => {
    await adapter.setItem('test-key', 'test-value');

    const value = await adapter.getItem('test-key');

    expect(value).toBe('test-value');
  });

  it('returns null for non-existent key', async () => {
    const value = await adapter.getItem('non-existent');

    expect(value).toBeNull();
  });

  it('removes an item', async () => {
    await adapter.setItem('test-key', 'test-value');

    await adapter.removeItem('test-key');

    const value = await adapter.getItem('test-key');
    expect(value).toBeNull();
  });

  it('overwrites existing item', async () => {
    await adapter.setItem('test-key', 'first-value');
    await adapter.setItem('test-key', 'second-value');

    const value = await adapter.getItem('test-key');

    expect(value).toBe('second-value');
  });
});
