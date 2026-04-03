// app/utils/regimen.ts
// Map meal plan codes to i18n keys
const REGIMEN_I18N_MAP: Record<string, string> = {
  // Backend codes (from API) → i18n keys
  RO: 'hotels.results.soleLodging',
  BB: 'hotels.results.lodgingAndBreakfast',
  HB: 'hotels.results.halfBoard',
  FB: 'hotels.results.fullBoard',
  AI: 'hotels.results.allInclusive',
  // Legacy codes (fallback for compatibility)
  SA: 'hotels.results.soleLodging',
  CP: 'hotels.results.lodgingAndBreakfast',
  MP: 'hotels.results.halfBoard',
  PC: 'hotels.results.fullBoard',
  TI: 'hotels.results.allInclusive',
};

// Fallback labels if i18n not available
const REGIMEN_LABELS: Record<string, string> = {
  RO: 'Room Only',
  BB: 'Bed & Breakfast',
  HB: 'Half Board',
  FB: 'Full Board',
  AI: 'All Inclusive',
  SA: 'Room Only',
  CP: 'Bed & Breakfast',
  MP: 'Half Board',
  PC: 'Full Board',
  TI: 'All Inclusive',
};

export function getRegimenI18nKey(code: string): string {
  return REGIMEN_I18N_MAP[code] ?? '';
}

export function getRegimenLabel(code: string): string {
  return REGIMEN_LABELS[code] ?? code;
}
