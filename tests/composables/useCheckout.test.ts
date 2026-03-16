import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";

import { useCheckout } from "~/composables/useCheckout";

// Mock #imports (useState, useRuntimeConfig, useCookie)
vi.mock("#imports", async (importOriginal) => {
  const actual = await importOriginal<typeof import("#imports")>();
  return {
    ...actual,
    useState: vi.fn((key: string, init: () => unknown) => ref(init())),
    useRuntimeConfig: vi.fn(() => ({ public: { apiBaseUrl: "" } })),
    useCookie: vi.fn(() => ref("test-token")),
    navigateTo: vi.fn(),
  };
});

// Mock $fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("$fetch", mockFetch);

describe("useCheckout", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  const mockHotel = {
    id: "H1",
    name: "Hotel Test",
    stars: 4,
    image: "img.jpg",
    address: "Punta Cana",
  };
  const mockRoom = {
    id: "R1",
    name: "Suite",
    regimen: "TI",
    cancellation: "Sin gastos",
    cancellationPolicy: {
      refundable: true,
      penaltyFrom: "2026-06-01",
      penalties: [],
    },
    price: 1200,
  };
  const mockSearch = {
    checkIn: "2026-05-01",
    checkOut: "2026-05-05",
    rooms: [{ adults: 2, children: [] }],
  };

  it("selectRoom stores hotel, room, and search params", () => {
    const { selectRoom, selectedHotel, selectedRoom, searchParams } =
      useCheckout();
    selectRoom(mockHotel, mockRoom, mockSearch);
    expect(selectedHotel.value).toEqual(mockHotel);
    expect(selectedRoom.value).toEqual(mockRoom);
    expect(searchParams.value).toEqual(mockSearch);
  });

  it("clearCheckout resets all state to null", () => {
    const { selectRoom, clearCheckout, selectedHotel, selectedRoom } =
      useCheckout();
    selectRoom(mockHotel, mockRoom, mockSearch);
    clearCheckout();
    expect(selectedHotel.value).toBeNull();
    expect(selectedRoom.value).toBeNull();
  });

  it("isReady returns true when hotel, room, and searchParams are set", () => {
    const { selectRoom, isReady } = useCheckout();
    expect(isReady.value).toBe(false);
    selectRoom(mockHotel, mockRoom, mockSearch);
    expect(isReady.value).toBe(true);
  });

  it("confirmBooking calls POST /api/bookings then POST /api/payments", async () => {
    const mockBooking = { id: "TRV-20260516-AB12" };
    const mockPayment = { status: "paid" };
    mockFetch
      .mockResolvedValueOnce(mockBooking)
      .mockResolvedValueOnce(mockPayment);

    const { selectRoom, confirmBooking } = useCheckout();
    selectRoom(mockHotel, mockRoom, mockSearch);

    const pnr = await confirmBooking(
      { nombre: "Juan", apellido: "García" },
      "card",
      { number: "4111111111111111", expiry: "12/27", cvv: "123" },
    );

    expect(pnr).toBe("TRV-20260516-AB12");
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "/api/bookings",
      expect.objectContaining({ method: "POST" }),
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "/api/payments",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
