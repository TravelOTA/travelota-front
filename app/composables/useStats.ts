import { computed } from 'vue';
import { useAgencies } from '~/composables/useAgencies';
import { useBookings } from '~/composables/useBookings';
import { useSupportUsers } from '~/composables/useSupportUsers';

export function useStats() {
  const { agencies } = useAgencies();
  const { bookings } = useBookings();
  const { stats: supportStats } = useSupportUsers();

  const adminStats = computed(() => {
    const activeAgencies = agencies.value.filter(
      (a) => a.status === 'Activa',
    ).length;
    const totalBookings = bookings.value.length;
    const totalNetVolume = bookings.value.reduce(
      (acc, b) => acc + b.netPrice,
      0,
    );
    const confirmedBookings = bookings.value.filter(
      (b) => b.status === 'confirmed',
    ).length;
    const pendingPayment = bookings.value.filter(
      (b) => b.payment_status === 'pending_payment',
    ).length;

    return {
      activeAgencies,
      totalBookings,
      totalNetVolume,
      confirmedBookings,
      pendingPayment,
      totalSupportUsers: supportStats.value.total,
    };
  });

  const b2bStats = computed(() => {
    // These would ideally come from an API or filtered bookings
    const activeBookings = bookings.value.filter(
      (b) => b.status === 'confirmed',
    ).length;
    const monthlyBookings = bookings.value.length; // Simplified mock logic

    return {
      activeBookings,
      availableHotels: '500k+',
      activeDestinations: 180,
      monthlyBookings,
    };
  });

  return { adminStats, b2bStats };
}
