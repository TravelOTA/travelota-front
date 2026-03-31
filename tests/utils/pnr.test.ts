import { describe, it, expect } from 'vitest';
import { generatePNR } from '../../server/utils/pnr';

describe('generatePNR', () => {
  it('matches TRV-YYYYMMDD-XXXX format', () => {
    const pnr = generatePNR();
    expect(pnr).toMatch(/^TRV-\d{8}-[A-Z0-9]{4}$/);
  });

  it("contains today's date", () => {
    const pnr = generatePNR();
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    expect(pnr).toContain(`TRV-${y}${m}${d}-`);
  });

  it('generates unique PNRs across 100 calls', () => {
    const pnrs = new Set(Array.from({ length: 100 }, () => generatePNR()));
    expect(pnrs.size).toBe(100);
  });
});
