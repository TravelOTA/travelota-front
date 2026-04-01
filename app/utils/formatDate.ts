import { format, parseISO } from 'date-fns';
import { getLocalTimeZone } from '@internationalized/date';
import type { CalendarDate } from '@internationalized/date';

/**
 * Formatea un CalendarDate (@internationalized/date) o un objeto similar a "dd/MM/yy".
 * Usar en HotelSearchForm donde dateRange contiene CalendarDate objects.
 */
export const formatCalendarDate = (d: any): string => {
  if (!d) return '';
  if (typeof d.toDate === 'function') {
    return format(d.toDate(getLocalTimeZone()), 'dd/MM/yy');
  }
  if (d.year && d.month && d.day) {
    return format(new Date(d.year, d.month - 1, d.day), 'dd/MM/yy');
  }
  return '';
};

/**
 * Formatea una fecha ISO string ("2026-03-14") a "dd/MM/yy".
 * Usar en SearchSummaryBar donde searchParams almacena strings ISO.
 *
 * IMPORTANTE: usar parseISO (no `new Date(iso)`) para evitar el shift de UTC:
 * `new Date('2026-03-14')` parsea como medianoche UTC → en zonas UTC-N
 * aparece el día anterior. parseISO trata la cadena como hora local.
 */
export const formatIsoDate = (iso: string): string => {
  if (!iso) return '';
  return format(parseISO(iso), 'dd/MM/yy');
};
