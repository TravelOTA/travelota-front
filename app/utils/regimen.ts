// app/utils/regimen.ts
// Meal plan code to label mapping (for display without i18n)
const REGIMEN_LABELS: Record<string, string> = {
  // Backend codes (from API)
  RO: 'Sólo alojamiento',
  BB: 'Cama y desayuno',
  HB: 'Media pensión',
  FB: 'Pensión Completa',
  AI: 'Todo incluido',
  // Legacy codes (fallback for compatibility)
  SA: 'Sólo alojamiento',
  CP: 'Cama y desayuno',
  MP: 'Media pensión',
  PC: 'Pensión Completa',
  TI: 'Todo incluido',
};

export function getRegimenLabel(code: string): string {
  return REGIMEN_LABELS[code] ?? code;
}
