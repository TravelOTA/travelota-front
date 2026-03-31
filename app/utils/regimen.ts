// app/utils/regimen.ts
const REGIMEN_LABELS: Record<string, string> = {
  TI: 'Todo incluido',
  AI: 'All inclusive',
  MP: 'Media pensión',
  CP: 'Cama y desayuno',
  SA: 'Sólo alojamiento',
  BB: 'Bed & Breakfast',
};

export function getRegimenLabel(code: string): string {
  return REGIMEN_LABELS[code] ?? code;
}
