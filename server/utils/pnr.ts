/**
 * Utility to generate PNR (Passenger Name Record) strings.
 */
export function generatePNR(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const dateStr = `${y}${m}${d}`;

  // Generate 4-character alphanumeric random string
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `TRV-${dateStr}-${randomStr}`;
}
