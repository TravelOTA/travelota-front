import { useAgencies } from "~/composables/useAgencies";
import { useBookings } from "~/composables/useBookings";
import { useSupportUsers } from "~/composables/useSupportUsers";

export function useStats() {
  const { agencies } = useAgencies();
  const { bookings } = useBookings();
  const { stats: supportStats } = useSupportUsers();

  const adminStats = computed(() => {
    const activeAgencies = agencies.value.filter(
      (a) => a.status === "Activa",
    ).length;
    const totalBookings = bookings.value.length;
    const totalNetVolume = bookings.value.reduce(
      (acc, b) => acc + b.netPrice,
      0,
    );
    const confirmedBookings = bookings.value.filter(
      (b) => b.status === "Confirmada",
    ).length;
    const pendingPayment = bookings.value.filter(
      (b) => b.paymentStatus === "Pendiente Pago",
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

  return { adminStats };
}
