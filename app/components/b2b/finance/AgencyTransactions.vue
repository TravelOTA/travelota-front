<script setup lang="ts">
import { useWallet } from "~/composables/useWallet";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const { transactions } = useWallet();

const columns = [
  { accessorKey: "date", header: "Fecha" },
  { accessorKey: "description", header: "Descripción" },
  { accessorKey: "reference", header: "Referencia" },
  { accessorKey: "type", header: "Tipo" },
  { accessorKey: "amount", header: "Monto" },
];

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: es });
};

const formatAmount = (amount: number, type: string) => {
  const formatted = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return type === "charge" ? `-${formatted}` : `+${formatted}`;
};

const getBadgeProps = (type: string) => {
  switch (type) {
    case "charge":
      return {
        label: "Cargo",
        color: "orange",
        icon: "i-heroicons-arrow-up-right",
      };
    case "payment":
      return {
        label: "Abono",
        color: "green",
        icon: "i-heroicons-arrow-down-left",
      };
    case "refund":
      return {
        label: "Reembolso",
        color: "primary",
        icon: "i-heroicons-arrow-path",
      };
    default:
      return { label: "Otro", color: "gray", icon: "i-heroicons-document" };
  }
};
</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }" class="shadow-sm overflow-hidden">
    <template #header>
      <div class="flex items-center justify-between">
        <h3
          class="text-base font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-2"
        >
          <UIcon
            name="i-heroicons-document-text"
            class="w-5 h-5 text-gray-500"
          />
          Historial de Movimientos
        </h3>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-down-tray"
          size="sm"
          label="Exportar"
        />
      </div>
    </template>

    <UTable
      :data="transactions"
      :columns="columns as any"
      class="w-full whitespace-nowrap"
    >
      <template #date-cell="{ row }">
        <span class="text-gray-500 text-sm">{{
          formatDate(row.original.date)
        }}</span>
      </template>

      <template #description-cell="{ row }">
        <span class="font-medium text-gray-900 dark:text-white">{{
          row.original.description
        }}</span>
      </template>

      <template #reference-cell="{ row }">
        <span class="font-mono text-xs text-gray-500">{{
          row.original.reference || "—"
        }}</span>
      </template>

      <template #type-cell="{ row }">
        <UBadge
          :color="getBadgeProps(row.original.type).color as any"
          variant="subtle"
          size="xs"
          class="font-medium"
        >
          <UIcon
            :name="getBadgeProps(row.original.type).icon"
            class="mr-1 w-3 h-3"
          />
          {{ getBadgeProps(row.original.type).label }}
        </UBadge>
      </template>

      <template #amount-cell="{ row }">
        <span
          class="font-mono font-bold"
          :class="{
            'text-orange-600 dark:text-orange-400':
              row.original.type === 'charge',
            'text-green-600 dark:text-green-400':
              row.original.type === 'payment' || row.original.type === 'refund',
          }"
        >
          {{ formatAmount(row.original.amount, row.original.type) }}
        </span>
      </template>

      <template #empty-state>
        <div class="py-10 text-center text-sm text-gray-500">
          No hay movimientos registrados en la cartera.
        </div>
      </template>
    </UTable>
  </UCard>
</template>
