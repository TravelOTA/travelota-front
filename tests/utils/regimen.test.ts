// tests/utils/regimen.test.ts
import { describe, it, expect } from 'vitest';
import { getRegimenLabel } from '~/utils/regimen';

describe('getRegimenLabel', () => {
  it('returns "Todo incluido" for TI', () => {
    expect(getRegimenLabel('TI')).toBe('Todo incluido');
  });

  it('returns "Sólo alojamiento" for SA', () => {
    expect(getRegimenLabel('SA')).toBe('Sólo alojamiento');
  });

  it('returns "Media pensión" for MP', () => {
    expect(getRegimenLabel('MP')).toBe('Media pensión');
  });

  it('returns "Cama y desayuno" for CP', () => {
    expect(getRegimenLabel('CP')).toBe('Cama y desayuno');
  });

  it('returns "Bed & Breakfast" for BB', () => {
    expect(getRegimenLabel('BB')).toBe('Bed & Breakfast');
  });

  it('returns "All inclusive" for AI', () => {
    expect(getRegimenLabel('AI')).toBe('All inclusive');
  });

  it('returns the code itself for unknown codes', () => {
    expect(getRegimenLabel('XX')).toBe('XX');
  });
});
