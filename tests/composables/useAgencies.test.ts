import { describe, it, expect } from "vitest";
import { useAgencies } from "~/composables/useAgencies";
import { useAgencyGroups } from "~/composables/useAgencyGroups";

describe("useAgencies — data model", () => {
  it("mock agencies have all required new fields", () => {
    const { agencies } = useAgencies();
    for (const a of agencies.value) {
      expect(typeof a.rut).toBe("string");
      expect(typeof a.direccionRegistrada).toBe("string");
      expect(typeof a.web).toBe("string");
      expect(typeof a.nombreContacto).toBe("string");
      expect(typeof a.logo).toBe("string");
      expect(typeof a.colorPrimario).toBe("string");
      expect(a.agencyGroup === null || typeof a.agencyGroup === "string").toBe(
        true,
      );
    }
  });

  it("mock agency users have string ids", () => {
    const { agencies } = useAgencies();
    for (const a of agencies.value) {
      for (const u of a.users) {
        expect(typeof u.id).toBe("string");
      }
    }
  });
});

describe("useAgencies — agencyStats", () => {
  it("includes denied count", () => {
    const { agencyStats } = useAgencies();
    expect(typeof agencyStats.value.denied).toBe("number");
  });
});

describe("useAgencies — registerAgency", () => {
  it("adds a new agency with status Pendiente and correct field mapping", () => {
    const { agencies, registerAgency } = useAgencies();
    const before = agencies.value.length;

    registerAgency({
      nombreComercial: "Test Agency",
      direccionRegistrada: "Calle Test 1, Madrid",
      nif: "B12345678",
      telefono: "+34 900 000 000",
      email: "test@agency.com",
      web: "https://testagency.com",
      pais: "España",
      nombreContacto: "Ana Test",
      aceptaPrivacidad: true,
    });

    expect(agencies.value.length).toBe(before + 1);
    const created = agencies.value[agencies.value.length - 1];
    expect(created.status).toBe("Pendiente");
    expect(created.name).toBe("Test Agency");
    expect(created.rut).toBe("B12345678");
    expect(created.direccionRegistrada).toBe("Calle Test 1, Madrid");
    expect(created.web).toBe("https://testagency.com");
    expect(created.nombreContacto).toBe("Ana Test");
    expect(created.email).toBe("test@agency.com");
    expect(created.phone).toBe("+34 900 000 000");
    expect(created.country).toBe("España");
    expect(created.agencyGroup).toBeNull();
    expect(created.markup).toBe(0);
    expect(created.bookingsCount).toBe(0);
    expect(created.users).toHaveLength(0);
    expect(created.logo).toBe("");
    expect(created.colorPrimario).toBe("teal");
    expect(typeof created.id).toBe("string");
    expect(created.id.length).toBeGreaterThan(0);
  });

  it("stores empty string when web is not provided", () => {
    const { agencies, registerAgency } = useAgencies();
    registerAgency({
      nombreComercial: "No Web Agency",
      direccionRegistrada: "Calle Sin Web 0",
      nif: "C99999999",
      telefono: "+34 900 111 222",
      email: "noweb@agency.com",
      web: "",
      pais: "México",
      nombreContacto: "Bob Test",
      aceptaPrivacidad: true,
    });
    const created = agencies.value[agencies.value.length - 1];
    expect(created.web).toBe("");
  });
});

describe("useAgencies — approveAgency", () => {
  it("sets status to Activa, assigns group, sets markup, creates AdminAgencyUser", () => {
    const { agencies, registerAgency, approveAgency } = useAgencies();
    const { groups } = useAgencyGroups();

    registerAgency({
      nombreComercial: "Aprobar Agency",
      direccionRegistrada: "Av. Aprobar 100",
      nif: "A11111111",
      telefono: "+34 900 222 333",
      email: "aprobar@agency.com",
      web: "",
      pais: "España",
      nombreContacto: "María Contacto",
      aceptaPrivacidad: true,
    });

    const agency = agencies.value[agencies.value.length - 1];
    const group = groups.value[0];

    approveAgency(agency.id, group);

    expect(agency.status).toBe("Activa");
    expect(agency.agencyGroup).toBe(group.name);
    expect(agency.markup).toBe(group.baseMarkup);
    expect(agency.users).toHaveLength(1);
    expect(agency.users[0].name).toBe("María Contacto");
    expect(agency.users[0].email).toBe("aprobar@agency.com");
    expect(agency.users[0].role).toBe("Admin Agencia");
    expect(agency.users[0].status).toBe("Activo");
    expect(agency.users[0].lastLogin).toBe("—");
    expect(typeof agency.users[0].id).toBe("string");
  });
});

describe("useAgencies — denyAgency", () => {
  it("sets status to Denegada", () => {
    const { agencies, registerAgency, denyAgency } = useAgencies();

    registerAgency({
      nombreComercial: "Deny Agency",
      direccionRegistrada: "Calle Deny 0",
      nif: "D22222222",
      telefono: "+34 900 444 555",
      email: "deny@agency.com",
      web: "",
      pais: "Colombia",
      nombreContacto: "Pedro Deny",
      aceptaPrivacidad: true,
    });

    const agency = agencies.value[agencies.value.length - 1];
    denyAgency(agency.id);
    expect(agency.status).toBe("Denegada");
  });

  it("does nothing for unknown id", () => {
    const { agencies, denyAgency } = useAgencies();
    const before = agencies.value.map((a) => a.status);
    denyAgency("non-existent-id");
    const after = agencies.value.map((a) => a.status);
    expect(after).toEqual(before);
  });
});

describe("useAgencies — deleteAgency", () => {
  it("removes the agency from state", () => {
    const { agencies, registerAgency, denyAgency, deleteAgency } =
      useAgencies();

    registerAgency({
      nombreComercial: "Delete Agency",
      direccionRegistrada: "Calle Delete 0",
      nif: "E33333333",
      telefono: "+34 900 666 777",
      email: "delete@agency.com",
      web: "",
      pais: "Argentina",
      nombreContacto: "Luis Delete",
      aceptaPrivacidad: true,
    });

    const agency = agencies.value[agencies.value.length - 1];
    denyAgency(agency.id);
    const before = agencies.value.length;
    deleteAgency(agency.id);
    expect(agencies.value.length).toBe(before - 1);
    expect(agencies.value.find((a) => a.id === agency.id)).toBeUndefined();
  });
});
