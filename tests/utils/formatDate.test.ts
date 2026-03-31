import { describe, it, expect } from 'vitest';
import { formatCalendarDate, formatIsoDate } from '~/utils/formatDate';

describe('formatCalendarDate', () => {
  it('formats a CalendarDate to dd/MM/yy', () => {
    // Simular CalendarDate con toDate()
    const mockCalendarDate = {
      toDate: () => new Date('2026-03-14T12:00:00'),
    };
    expect(formatCalendarDate(mockCalendarDate as never)).toBe('14/03/26');
  });
});

describe('formatIsoDate', () => {
  it('formats an ISO string to dd/MM/yy without UTC day-shift', () => {
    // parseISO trata '2026-03-14' como hora local, no UTC midnight
    expect(formatIsoDate('2026-03-14')).toBe('14/03/26');
  });

  it('returns empty string for empty input', () => {
    expect(formatIsoDate('')).toBe('');
  });
});
