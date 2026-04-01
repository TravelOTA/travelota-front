import { format, parseISO } from 'date-fns';
import { getLocalTimeZone } from '@internationalized/date';
import type { CalendarDate } from '@internationalized/date';

/**
 * Formatea un CalendarDate (@internationalized/date) a "dd/MM/yy".
 * Usar en HotelSearchForm donde dateRange contiene CalendarDate objects.
 */
export const formatCalendarDate = (d: CalendarDate): string =>
  format(d.toDate(getLocalTimeZone()), 'dd/MM/yy');

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
