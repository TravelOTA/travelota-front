import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAgencies, type AdminAgency } from "~/composables/useAgencies";

import { apiFetch } from "~/composables/useApi";

// Mock apiFetch so tests run without a real server
vi.mock("~/composables/useApi", () => ({
  apiFetch: vi.fn(),
}));
const mockApiFetch = vi.mocked(apiFetch);

const MOCK_AGENCIES: AdminAgency[] = [
  {
    id: 1,
    url: "http://localhost/api/agency/agencies/1",
    commercial_name: "Viajes El Corte Inglés",
    fiscal_id: "A28010615",
    address: "Calle de Hermosilla 112, 28009 Madrid",
    web: "https://www.elcorteingles.es/viajes",
    contact_name: "María Gómez",
    country: "España",
    email: "b2b@elcorteingles.es",
    phone: "+34 91 418 88 00",
    public_email: "atencion@elcorteingles.es",
    public_phone: "+34 900 100 100",
    logo: "",
    primary_color: "teal",
    agency_group: { id: 1, name: "Grupo VIP" },
    markup: 12,
    status: "active",
    user_count: 3,
    booking_count: 312,
    created_at: "2024-03-15T00:00:00Z",
    next_settlement: null,
  },
  {
    id: 2,
    url: "http://localhost/api/agency/agencies/2",
    commercial_name: "Agencia Demo",
    fiscal_id: "RFC123456MX0",
    address: "Av. Insurgentes Sur 1602, CDMX",
    web: "",
    contact_name: "Ana Ruiz",
    country: "México",
    email: "contacto@agenciademo.mx",
    phone: "+52 55 1234 5678",
    public_email: "",
    public_phone: "",
    logo: "",
    primary_color: "green",
    agency_group: null,
    markup: 0,
    status: "pending",
    user_count: 0,
    booking_count: 0,
    created_at: "2026-02-28T00:00:00Z",
    next_settlement: null,
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useAgencies — AdminAgency interface", () => {
  it("AdminAgency has all required fields", () => {
    const agency = MOCK_AGENCIES[0]!;
    expect(typeof agency.id).toBe("number");
    expect(typeof agency.commercial_name).toBe("string");
    expect(typeof agency.fiscal_id).toBe("string");
    expect(typeof agency.address).toBe("string");
    expect(typeof agency.web).toBe("string");
    expect(typeof agency.contact_name).toBe("string");
    expect(typeof agency.email).toBe("string");
    expect(typeof agency.phone).toBe("string");
    expect(typeof agency.public_email).toBe("string");
    expect(typeof agency.public_phone).toBe("string");
    expect(typeof agency.logo).toBe("string");
    expect(typeof agency.primary_color).toBe("string");
    expect(typeof agency.markup).toBe("number");
    expect(typeof agency.user_count).toBe("number");
    expect(typeof agency.booking_count).toBe("number");
    expect(typeof agency.created_at).toBe("string");
  });

  it("agency_group can be null or an object with id and name", () => {
    const withGroup = MOCK_AGENCIES[0]!;
    const withoutGroup = MOCK_AGENCIES[1]!;
    expect(withGroup.agency_group).toEqual({ id: 1, name: "Grupo VIP" });
    expect(withoutGroup.agency_group).toBeNull();
  });

  it("status is one of the expected API values", () => {
    const validStatuses = ["active", "pending", "blocked", "denied"];
    for (const agency of MOCK_AGENCIES) {
      expect(validStatuses).toContain(agency.status);
    }
  });
});

describe("useAgencies — agencyStats", () => {
  it("computes stats from agency status values", () => {
    const { agencies, agencyStats } = useAgencies();
    agencies.value = MOCK_AGENCIES;

    expect(agencyStats.value.total).toBe(2);
    expect(agencyStats.value.active).toBe(1);
    expect(agencyStats.value.pending).toBe(1);
    expect(agencyStats.value.blocked).toBe(0);
    expect(agencyStats.value.denied).toBe(0);
  });

  it("includes denied count as a number", () => {
    const { agencyStats } = useAgencies();
    expect(typeof agencyStats.value.denied).toBe("number");
  });
});

describe("useAgencies — fetchAgencies", () => {
  it("populates agencies from a paginated API response", async () => {
    mockApiFetch.mockResolvedValueOnce({
      results: MOCK_AGENCIES,
      count: 2,
      next: null,
      previous: null,
    });

    const { agencies, fetchAgencies } = useAgencies();
    await fetchAgencies();

    expect(agencies.value).toHaveLength(2);
    expect(agencies.value[0]!.commercial_name).toBe("Viajes El Corte Inglés");
  });

  it("populates agencies from a flat array API response", async () => {
    mockApiFetch.mockResolvedValueOnce(MOCK_AGENCIES);

    const { agencies, fetchAgencies } = useAgencies();
    await fetchAgencies();

    expect(agencies.value).toHaveLength(2);
  });

  it("sets error on fetch failure", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Network error"));

    const { error, fetchAgencies } = useAgencies();
    await fetchAgencies();

    expect(error.value).toBe("Network error");
  });
});

describe("useAgencies — getAgencyById", () => {
  it("finds an agency by numeric id", () => {
    const { agencies, getAgencyById } = useAgencies();
    agencies.value = MOCK_AGENCIES;

    const found = getAgencyById(1);
    expect(found?.commercial_name).toBe("Viajes El Corte Inglés");
  });

  it("finds an agency by string id", () => {
    const { agencies, getAgencyById } = useAgencies();
    agencies.value = MOCK_AGENCIES;

    const found = getAgencyById("2");
    expect(found?.commercial_name).toBe("Agencia Demo");
  });

  it("returns undefined for unknown id", () => {
    const { agencies, getAgencyById } = useAgencies();
    agencies.value = MOCK_AGENCIES;

    expect(getAgencyById(999)).toBeUndefined();
  });
});

describe("useAgencies — updateAgency", () => {
  it("updates the agency in local state after PATCH", async () => {
    const updated = { ...MOCK_AGENCIES[0]!, commercial_name: "Updated Name" };
    mockApiFetch.mockResolvedValueOnce(updated);

    const { agencies, updateAgency } = useAgencies();
    agencies.value = [...MOCK_AGENCIES];

    await updateAgency(1, { commercial_name: "Updated Name" });

    expect(agencies.value[0]!.commercial_name).toBe("Updated Name");
    expect(mockApiFetch).toHaveBeenCalledWith(
      "/api/agency/agencies/1",
      expect.objectContaining({ method: "PATCH" }),
    );
  });
});

describe("useAgencies — approveAgency", () => {
  it("calls updateAgency with status active and group id", async () => {
    const approved = {
      ...MOCK_AGENCIES[1]!,
      status: "active" as const,
      agency_group: { id: 3, name: "Grupo Estándar" },
    };
    mockApiFetch.mockResolvedValueOnce(approved);

    const { agencies, approveAgency } = useAgencies();
    agencies.value = [...MOCK_AGENCIES];

    await approveAgency(2, 3);

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/api/agency/agencies/2",
      expect.objectContaining({
        method: "PATCH",
        body: expect.objectContaining({ status: "active" }),
      }),
    );
  });
});

describe("useAgencies — denyAgency", () => {
  it("calls updateAgency with status denied", async () => {
    const denied = { ...MOCK_AGENCIES[1]!, status: "denied" as const };
    mockApiFetch.mockResolvedValueOnce(denied);

    const { agencies, denyAgency } = useAgencies();
    agencies.value = [...MOCK_AGENCIES];

    await denyAgency(2);

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/api/agency/agencies/2",
      expect.objectContaining({
        method: "PATCH",
        body: expect.objectContaining({ status: "denied" }),
      }),
    );
  });
});

describe("useAgencies — toggleBlock", () => {
  it("blocks an active agency", async () => {
    const blocked = { ...MOCK_AGENCIES[0]!, status: "blocked" as const };
    mockApiFetch.mockResolvedValueOnce(blocked);

    const { agencies, toggleBlock } = useAgencies();
    agencies.value = [...MOCK_AGENCIES];

    await toggleBlock(1);

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/api/agency/agencies/1",
      expect.objectContaining({
        method: "PATCH",
        body: expect.objectContaining({ status: "blocked" }),
      }),
    );
  });

  it("activates a blocked agency", async () => {
    const blockedAgency: AdminAgency = {
      ...MOCK_AGENCIES[0]!,
      status: "blocked",
    };
    const activated: AdminAgency = { ...blockedAgency, status: "active" };
    mockApiFetch.mockResolvedValueOnce(activated);

    const { agencies, toggleBlock } = useAgencies();
    agencies.value = [blockedAgency, MOCK_AGENCIES[1]!];

    await toggleBlock(1);

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/api/agency/agencies/1",
      expect.objectContaining({
        method: "PATCH",
        body: expect.objectContaining({ status: "active" }),
      }),
    );
  });
});

describe("useAgencies — deleteAgency", () => {
  it("removes the agency from local state after DELETE", async () => {
    mockApiFetch.mockResolvedValueOnce(undefined);

    const { agencies, deleteAgency } = useAgencies();
    agencies.value = [...MOCK_AGENCIES];

    await deleteAgency(1);

    expect(agencies.value).toHaveLength(1);
    expect(agencies.value.find((a) => a.id === 1)).toBeUndefined();
    expect(mockApiFetch).toHaveBeenCalledWith(
      "/api/agency/agencies/1",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
