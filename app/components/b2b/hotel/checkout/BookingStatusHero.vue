<script setup lang="ts">
const props = defineProps<{
  /**
   * 'confirmation' = recién confirmada desde el checkout
   * 'detail'       = acceso desde el listado de reservas
   */
  origin: "confirmation" | "detail";
  bookingStatus: string; // Confirmada, Cancelada, Vencida
  paymentStatus: string; // Pagada, Pendiente Pago
  bookingId: string;
  paymentDeadline?: string;
  cancelledDate?: string;
}>();

const statusConfig = computed(() => {
  // Caso 1: Viene del checkout (recién confirmada)
  if (props.origin === "confirmation") {
    return {
      icon: "i-heroicons-check-circle-solid",
      bgClass:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      iconBgClass: "bg-green-100 dark:bg-green-800",
      iconClass: "text-green-600 dark:text-green-400",
      titleClass: "text-green-800 dark:text-green-400",
      subtitleClass: "text-green-700 dark:text-green-300",
      title: "¡Reserva Confirmada Exitosamente!",
      subtitle:
        "Hemos enviado un correo de confirmación con los detalles de esta reserva.",
    };
  }

  // Caso 2: Cancelada
  if (props.bookingStatus === "Cancelada") {
    return {
      icon: "i-heroicons-x-circle-solid",
      bgClass:
        "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      iconBgClass: "bg-red-100 dark:bg-red-800",
      iconClass: "text-red-600 dark:text-red-400",
      titleClass: "text-red-800 dark:text-red-400",
      subtitleClass: "text-red-700 dark:text-red-300",
      title: "CANCELADA",
      subtitle: props.cancelledDate
        ? `Cancelada el: ${props.cancelledDate}`
        : "Esta reserva ha sido cancelada.",
    };
  }

  // Caso 3: Vencida
  if (props.bookingStatus === "Vencida") {
    return {
      icon: "i-heroicons-exclamation-triangle-solid",
      bgClass:
        "bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
      iconBgClass: "bg-gray-200 dark:bg-gray-700",
      iconClass: "text-gray-500 dark:text-gray-400",
      titleClass: "text-gray-700 dark:text-gray-400",
      subtitleClass: "text-gray-600 dark:text-gray-400",
      title: "VENCIDA",
      subtitle: "La fecha límite de pago ha expirado.",
    };
  }

  // Caso 4: Confirmada + Pendiente Pago
  if (props.paymentStatus === "Pendiente Pago") {
    return {
      icon: "i-heroicons-clock-solid",
      bgClass:
        "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
      iconBgClass: "bg-amber-100 dark:bg-amber-800",
      iconClass: "text-amber-600 dark:text-amber-400",
      titleClass: "text-amber-800 dark:text-amber-400",
      subtitleClass: "text-amber-700 dark:text-amber-300",
      title: "CONFIRMADA · PENDIENTE PAGO",
      subtitle: props.paymentDeadline
        ? `Fecha límite de pago: ${props.paymentDeadline}`
        : "La reserva está confirmada pero pendiente de pago.",
    };
  }

  // Caso 5: Confirmada + Pagada (default)
  return {
    icon: "i-heroicons-check-circle-solid",
    bgClass:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    iconBgClass: "bg-green-100 dark:bg-green-800",
    iconClass: "text-green-600 dark:text-green-400",
    titleClass: "text-green-800 dark:text-green-400",
    subtitleClass: "text-green-700 dark:text-green-300",
    title: "CONFIRMADA · PAGADA",
    subtitle: `Localizador: ${props.bookingId}`,
  };
});
</script>

<template>
  <div
    class="border rounded-lg p-6 mb-8 flex flex-col items-center text-center"
    :class="statusConfig.bgClass"
  >
    <div
      class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
      :class="statusConfig.iconBgClass"
    >
      <UIcon
        :name="statusConfig.icon"
        class="w-10 h-10"
        :class="statusConfig.iconClass"
      />
    </div>
    <h1
      class="text-2xl md:text-3xl font-black tracking-tight mb-2"
      :class="statusConfig.titleClass"
    >
      {{ statusConfig.title }}
    </h1>
    <p :class="statusConfig.subtitleClass">
      {{ statusConfig.subtitle }}
    </p>
  </div>
</template>
