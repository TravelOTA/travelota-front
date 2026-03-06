export interface AgencyGroup {
  id: string;
  name: string;
  description: string;
  baseMarkup: number;
  agenciesCount: number;
}

// Global state for mocking API calls
const groups = ref<AgencyGroup[]>([
  {
    id: "GRP-001",
    name: "Grupo VIP",
    description: "Agencias con volumen alto de ventas y soporte 24/7.",
    baseMarkup: 12,
    agenciesCount: 2,
  },
  {
    id: "GRP-002",
    name: "Grupo Mayorista",
    description: "Distribuidores a gran escala.",
    baseMarkup: 10,
    agenciesCount: 1,
  },
  {
    id: "GRP-003",
    name: "Grupo Estándar",
    description: "Agencias minoristas comunes.",
    baseMarkup: 15,
    agenciesCount: 3,
  },
  {
    id: "GRP-004",
    name: "Corpo",
    description: "Cuentas corporativas.",
    baseMarkup: 8,
    agenciesCount: 0,
  },
]);

export function useAgencyGroups() {
  function addGroup(group: Omit<AgencyGroup, "id" | "agenciesCount">) {
    groups.value.push({
      id: `GRP-00${groups.value.length + 1}`,
      ...group,
      agenciesCount: 0,
    });
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

  return {
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
    incrementAgencyCount,
  };
}
