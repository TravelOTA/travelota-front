export interface SupportUser {
  id: number;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SUPPORT';
  status: 'Activo' | 'Inactivo';
  lastLogin: string;
}

const MOCK_SUPPORT_USERS: SupportUser[] = [
  {
    id: 1,
    name: 'Laura Martínez',
    email: 'laura@travelota.com',
    role: 'SUPER_ADMIN',
    lastLogin: '2026-03-05',
    status: 'Activo',
  },
  {
    id: 2,
    name: 'Carlos Ríos',
    email: 'carlos@travelota.com',
    role: 'SUPPORT',
    lastLogin: '2026-03-04',
    status: 'Activo',
  },
  {
    id: 3,
    name: 'Sofía Delgado',
    email: 'sofia@travelota.com',
    role: 'SUPPORT',
    lastLogin: '2026-02-28',
    status: 'Inactivo',
  },
];

export function useSupportUsers() {
  const users = useState<SupportUser[]>(
    'support-users',
    () => MOCK_SUPPORT_USERS,
  );

  const stats = computed(() => ({
    total: users.value.length,
    active: users.value.filter((u) => u.status === 'Activo').length,
    admins: users.value.filter((u) => u.role === 'SUPER_ADMIN').length,
    support: users.value.filter((u) => u.role === 'SUPPORT').length,
  }));

  function addUser(data: Omit<SupportUser, 'id' | 'lastLogin' | 'status'>) {
    users.value.push({
      id: users.value.length + 1,
      lastLogin: '—',
      status: 'Activo',
      ...data,
    });
  }

  function updateUser(id: number, data: Partial<SupportUser>) {
    const user = users.value.find((u) => u.id === id);
    if (user) Object.assign(user, data);
  }

  function deleteUser(id: number) {
    users.value = users.value.filter((u) => u.id !== id);
  }

  function toggleStatus(id: number) {
    const user = users.value.find((u) => u.id === id);
    if (user) {
      user.status = user.status === 'Activo' ? 'Inactivo' : 'Activo';
    }
  }

  return {
    users,
    stats,
    addUser,
    updateUser,
    deleteUser,
    toggleStatus,
  };
}
