import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mocks setup (must run before plugin import) ---

const mockToastAdd = vi.fn();
const mockLogout = vi.fn();
const mockNavigateTo = vi.fn();
const mockT = vi.fn((key: string) => key);

// Stub Nuxt globals used by the plugin
vi.stubGlobal('defineNuxtPlugin', (fn: (app: unknown) => void) => fn);
vi.stubGlobal('useI18n', () => ({ t: mockT }));
vi.stubGlobal('useToast', () => ({ add: mockToastAdd }));
vi.stubGlobal('useAuth', () => ({ logout: mockLogout }));
vi.stubGlobal('navigateTo', mockNavigateTo);

// Capture the onResponseError handler registered by the plugin
let capturedHandler: (ctx: {
  response: { status: number };
  request: RequestInfo;
}) => Promise<void>;

vi.stubGlobal('$fetch', {
  create: vi.fn((opts: { onResponseError: typeof capturedHandler }) => {
    capturedHandler = opts.onResponseError;
    return {};
  }),
});

// --- Import plugin AFTER globals are stubbed ---
const { default: plugin } = await import('~/plugins/error-handler.client');

// Run the plugin (defineNuxtPlugin is mocked to call fn directly)
(plugin as (app: unknown) => void)(null);

// --- Helpers ---

function makeCtx(status: number, url: string) {
  return {
    response: { status },
    request: url,
  };
}

// --- Tests ---

describe('error-handler plugin', () => {
  beforeEach(() => {
    mockToastAdd.mockReset();
    mockLogout.mockReset();
    mockNavigateTo.mockReset();
  });

  it('401 — calls logout, navigates to /, shows unauthorized toast', async () => {
    await capturedHandler(makeCtx(401, '/api/bookings'));

    expect(mockLogout).toHaveBeenCalledOnce();
    expect(mockNavigateTo).toHaveBeenCalledWith('/');
    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'errors.unauthorized' }),
    );
  });

  it('401 on /api/auth/login — does NOT logout or show toast', async () => {
    await capturedHandler(makeCtx(401, '/api/auth/login'));

    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockNavigateTo).not.toHaveBeenCalled();
    expect(mockToastAdd).not.toHaveBeenCalled();
  });

  it('403 — shows forbidden toast, no logout', async () => {
    await capturedHandler(makeCtx(403, '/api/agencies/1/approve'));

    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'errors.forbidden' }),
    );
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('422 — shows unprocessable toast, no logout', async () => {
    await capturedHandler(makeCtx(422, '/api/agencies'));

    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'errors.unprocessable' }),
    );
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('500 — shows serverError toast, no logout', async () => {
    await capturedHandler(makeCtx(500, '/api/bookings'));

    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'errors.serverError' }),
    );
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('503 — shows serverError toast (any 5xx)', async () => {
    await capturedHandler(makeCtx(503, '/api/hotels'));

    expect(mockToastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'errors.serverError' }),
    );
  });
});
