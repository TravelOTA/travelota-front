import { readBookings } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let bookings = await readBookings();

  if (query.order_ref) {
    bookings = bookings.filter((b) => b.order_ref === query.order_ref);
  }

  const results = bookings.map((b) => ({
    // If the db generated an id different from pnr, map it. Otherwise fallback to ID.
    id: b.pnr || b.id,
    pnr: b.pnr || b.id,
    hotel_name: b.hotel?.name || 'Hotel Genérico Simulado',
    order_ref: b.order_ref,
  }));

  return {
    count: results.length,
    next: null,
    previous: null,
    results: results,
  };
});
