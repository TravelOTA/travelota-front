const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generatePNR(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const suffix = Array.from(
    { length: 4 },
    () => CHARS[crypto.getRandomValues(new Uint8Array(1))[0]! % CHARS.length]!,
  ).join('');
  return `TRV-${year}${month}${day}-${suffix}`;
}
