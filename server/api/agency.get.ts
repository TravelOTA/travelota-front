import type { Agency } from '../../app/utils/schemas';

// Mock data — replace with real DB/service call when backend is ready
export default defineEventHandler((): Agency => {
  return {
    commercial_name: 'Viajes El Corte Inglés',
    fiscal_id: 'B-12345678',
    country: 'España',
    email: 'b2b@elcorteingles.es',
    phone: '+34 91 418 88 00',
    address: 'Hermosilla 112, Madrid, España',
    logo: 'https://ui-avatars.com/api/?name=V+C&color=0284c7&background=e0f2fe',
    primary_color: 'sky',
    created_at: '2024-03-15',
    status: 'Activa',
    user_count: 8,
    booking_count: 312,
    next_settlement: '2026-04-01',
    markup: 10,
  };
});
