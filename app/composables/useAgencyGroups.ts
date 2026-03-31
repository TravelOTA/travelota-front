import { useState } from "#imports";

export interface AgencyGroup {
  id: string;
  name: string;
  description: string;
  baseMarkup: number;
  baseCreditLimit: number;
  agenciesCount: number;
}

const MOCK_GROUPS: AgencyGroup[] = [
  {
    id: "GRP-001",
    name: "Grupo VIP",
    description: "Agencias con volumen alto de ventas y soporte 24/7.",
    baseMarkup: 12,
    baseCreditLimit: 10000,
    agenciesCount: 2,
  },
  {
    id: "GRP-002",
    name: "Grupo Mayorista",
    description: "Distribuidores a gran escala.",
    baseMarkup: 10,
    baseCreditLimit: 8000,
    agenciesCount: 1,
  },
  {
    id: "GRP-003",
    name: "Grupo Estándar",
    description: "Agencias minoristas comunes.",
    baseMarkup: 15,
    baseCreditLimit: 5000,
    agenciesCount: 3,
  },
  {
    id: "GRP-004",
    name: "Corpo",
    description: "Cuentas corporativas.",
    baseMarkup: 8,
    baseCreditLimit: 15000,
    agenciesCount: 0,
  },
];

export function useAgencyGroups() {
  const groups = useState<AgencyGroup[]>("agency-groups", () => MOCK_GROUPS);

  function addGroup(group: Omit<AgencyGroup, "id" | "agenciesCount">) {
    const nextId = `GRP-${String(groups.value.length + 1).padStart(3, "0")}`;
    groups.value.push({ id: nextId, ...group, agenciesCount: 0 });
  }

  function updateGroup(
    id: string,
    groupData: Omit<AgencyGroup, "id" | "agenciesCount">,
  ) {
    const index = groups.value.findIndex((g) => g.id === id);
    if (index !== -1) {
      groups.value[index] = {
        ...groups.value[index]!,
        ...groupData,
      } as AgencyGroup;
    }
  }

  function deleteGroup(id: string) {
    groups.value = groups.value.filter((g) => g.id !== id);
  }

  function incrementAgencyCount(groupName: string) {
    const group = groups.value.find((g) => g.name === groupName);
    if (group) {
      group.agenciesCount++;
    }
  }

  return { groups, addGroup, updateGroup, deleteGroup, incrementAgencyCount };
}
