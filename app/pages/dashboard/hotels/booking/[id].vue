<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSalePrice } from '~/composables/useSalePrice';

import CheckoutSidebarSummary from '~/components/b2b/hotel/checkout/CheckoutSidebarSummary.vue';
import BookingStatusHero from '~/components/b2b/hotel/checkout/BookingStatusHero.vue';
import BookingCancellation from '~/components/b2b/hotel/checkout/BookingCancellation.vue';
import BookingPayment from '~/components/b2b/hotel/checkout/BookingPayment.vue';
import VoucherPreviewModal, {
  type VoucherReservation,
} from '~/components/b2b/hotel/checkout/VoucherPreviewModal.vue';
import { useBookings } from '~/composables/useBookings';
import { apiFetch } from '~/composables/useApi';
import type { IBooking } from '#shared/types/booking';

const { t } = useI18n();
const { salePrice } = useSalePrice();

definePageMeta({
  layout: 'dashboard',
});

const route = useRoute();
const router = useRouter();

// Determine origin: 'confirmation' (from checkout) vs 'detail' (from bookings list)
const origin = computed(() =>
  route.query.from === 'confirmation' ? 'confirmation' : 'detail',
);

const bookingId = route.params.id as string;

const { getBookingById } = useBookings();
const booking = ref<IBooking | null>(null);
const loading = ref(true);
const notFound = ref(false);

onMounted(async () => {
  try {
    booking.value = await getBookingById(bookingId);
    if (!booking.value) notFound.value = true;
  } finally {
    loading.value = false;
  }
});

const bookingStatusLabel = computed(() =>
  booking.value
    ? t(
        `hotels.bookingStatusLabel.${booking.value.status}`,
        booking.value.status,
      )
    : '',
);
const paymentStatusLabel = computed(() =>
  booking.value
    ? t(
        `hotels.paymentStatusLabel.${booking.value.payment_status}`,
        booking.value.payment_status,
      )
    : '',
);

// Computed props for child components
const hotelProp = computed(() =>
  booking.value && booking.value.hotel_snapshot
    ? {
        name: booking.value.hotel_snapshot.name,
        stars: booking.value.hotel_snapshot.stars,
        address: booking.value.hotel_snapshot.address,
        image: booking.value.hotel_snapshot.image,
      }
    : null,
);

const reservationProp = computed(() =>
  booking.value
    ? {
        titular: booking.value.passengers?.[0]
          ? `${booking.value.passengers[0].first_name} ${booking.value.passengers[0].last_name}`
          : '—',
        agent: 'Sistema', // Field createdBy is not in new IBooking, using placeholder
        checkIn: booking.value.check_in,
        checkOut: booking.value.check_out,
        rooms: [
          {
            id: '1',
            name: booking.value.room_description,
            pax: `${booking.value.pax} ${t('hotels.search.guests')}`,
            price: salePrice(parseFloat(booking.value.sell_rate)),
            netPrice: parseFloat(booking.value.net_rate),
          },
        ],
      }
    : null,
);

// Cancellation policies derived from IBooking
const cancellationPolicies = computed(() => {
  if (!booking.value) return [];
  return (booking.value.cancellation_policies ?? []).map((p) => ({
    status: p.description || t('hotels.cancellation.penalty'),
    fromDate: p.deadline,
    toDate: p.deadline,
    time: '23:59 CET',
    price: parseFloat(p.penalty_amount),
  }));
});

// Computed flags for conditional rendering
const showCancellation = computed(
  () =>
    booking.value?.status !== 'cancelled' &&
    booking.value?.status !== 'expired',
);

const paidDate = computed(() =>
  booking.value?.paid_at
    ? new Date(booking.value.paid_at).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : undefined,
);

const paymentDeadline = computed(
  () => booking.value?.transfer_deadline ?? undefined,
);

const emptyReservation: VoucherReservation = {
  titular: '',
  agent: '',
  checkIn: '',
  checkOut: '',
  rooms: [],
};

const isVoucherModalOpen = ref(false);
const documentMode = ref<'voucher' | 'invoice'>('voucher');

const openDocument = (mode: 'voucher' | 'invoice') => {
  documentMode.value = mode;
  isVoucherModalOpen.value = true;
};

const siblingBookings = ref<
  { id: string | number; pnr: string; hotel_name: string; order_ref: string }[]
>([]);

watch(
  () => (booking.value as { order_ref?: string } | null)?.order_ref,
  async (orderRef) => {
    if (!orderRef) {
      siblingBookings.value = [];
      return;
    }
    try {
      const data = await apiFetch<{
        results?: {
          id: string | number;
          pnr: string;
          hotel_name: string;
          order_ref: string;
        }[];
      }>(`/api/agency/bookings?order_ref=${orderRef}`);
      const currentId = route.params.id;
      siblingBookings.value = (data?.results ?? []).filter(
        (b) => String(b.id) !== String(currentId),
      );
    } catch {
      siblingBookings.value = [];
    }
  },
  { immediate: true },
);

useHead({
  title: () =>
    `Reserva ${booking.value?.pnr || bookingId} - TravelOTA B2B`,
});
</script>

<template>
  <div class="max-w-[1000px] mx-auto pb-12 pt-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon
        name="i-heroicons-arrow-path"
        class="animate-spin text-3xl text-primary-500"
      />
    </div>

    <!-- Not found state -->
    <div v-else-if="notFound" class="text-center py-20 text-gray-500">
      {{ t('hotels.bookingDetail.notFound') }}
    </div>

    <!-- Booking detail -->
    <template v-else-if="booking">
      <!-- Dynamic Status Hero -->
      <BookingStatusHero
        :origin="origin"
        :booking-status="bookingStatusLabel"
        :payment-status="paymentStatusLabel"
        :booking-id="booking.pnr"
        :payment-deadline="paymentDeadline"
        :cancelled-date="undefined"
      />

      <!-- Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: PNR Data, Payment, Cancellation & Action Buttons -->
        <div class="lg:col-span-2 flex flex-col gap-6 order-last lg:order-none">
          <!-- PNR Card -->
          <div
            class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm"
          >
            <div
              class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
            >
              <div>
                <p
                  class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
                >
                  {{ t('hotels.bookingDetail.pnrLabel') }}
                </p>
                <h2
                  class="text-3xl font-black text-primary-600 dark:text-primary-400 tracking-tight flex items-center gap-2"
                >
                  {{ booking.pnr }}
                  <UBadge
                    :color="
                      booking.status === 'confirmed'
                        ? 'success'
                        : booking.status === 'cancelled'
                          ? 'error'
                          : 'warning'
                    "
                    variant="soft"
                    class="ml-2 px-2 py-1 text-xs uppercase tracking-wider font-bold"
                  >
                    {{ bookingStatusLabel }}
                  </UBadge>
                  <UBadge
                    v-if="booking.status !== 'cancelled'"
                    :color="
                      booking.payment_status === 'paid' ? 'success' : 'warning'
                    "
                    variant="subtle"
                    class="px-2 py-1 text-xs uppercase tracking-wider font-bold"
                  >
                    {{ paymentStatusLabel }}
                  </UBadge>
                </h2>
              </div>
            </div>

            <hr class="border-gray-100 dark:border-gray-800 mb-6" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p
                  class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
                >
                  {{ t('hotels.bookingDetail.titular') }}
                </p>
                <p
                  class="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2"
                >
                  <UIcon
                    name="i-heroicons-user"
                    class="w-4 h-4 text-gray-400"
                  />
                  {{ booking.passengers?.[0]?.first_name }}
                  {{ booking.passengers?.[0]?.last_name }}
                </p>
              </div>
              <div>
                <p
                  class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
                >
                  {{ t('hotels.bookingDetail.agencyReference') }}
                </p>
                <p class="font-bold text-gray-900 dark:text-white text-lg">
                  {{ booking.order_ref || 'N/A' }}
                </p>
              </div>
              <div>
                <p
                  class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
                >
                  {{ t('hotels.bookingDetail.confirmationEmail') }}
                </p>
                <p
                  class="text-gray-900 dark:text-gray-300 flex items-center gap-2"
                >
                  <UIcon
                    name="i-heroicons-envelope"
                    class="w-4 h-4 text-gray-400"
                  />
                  info@agencia-viajes.com
                </p>
              </div>
              <div>
                <p
                  class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
                >
                  {{ t('hotels.bookingDetail.responsibleAgent') }}
                </p>
                <p class="text-gray-900 dark:text-gray-300">Sistema</p>
              </div>
              <div class="md:col-span-2">
                <p
                  class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
                >
                  {{ t('hotels.bookingDetail.creationDate') }}
                </p>
                <p
                  class="text-gray-900 dark:text-gray-300 flex items-center gap-2"
                >
                  <UIcon
                    name="i-heroicons-calendar-days"
                    class="w-4 h-4 text-gray-400"
                  />
                  {{ new Date(booking.created_at).toLocaleDateString('es-ES') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Payment Status Component (always visible, adapts to paid or pending) -->
          <BookingPayment
            v-if="booking.status !== 'expired'"
            :payment-status="paymentStatusLabel"
            :total-price="parseFloat(booking.sell_rate)"
            :payment-deadline="paymentDeadline"
            :paid-date="paidDate"
          />

          <!-- Cancellation Component (hidden for expired bookings) -->
          <BookingCancellation
            v-if="showCancellation || booking.status === 'cancelled'"
            :booking-status="bookingStatusLabel"
            :total-price="parseFloat(booking.sell_rate)"
            :policies="cancellationPolicies"
          />

          <!-- B2B Actions Card -->
          <div
            class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <h3 class="font-bold text-gray-900 dark:text-white mb-4">
              {{ t('hotels.bookingDetail.documentsAndActions') }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UButton
                block
                color="primary"
                variant="outline"
                icon="i-heroicons-document-arrow-down"
                class="font-bold justify-start py-3"
                @click="openDocument('voucher')"
              >
                <div class="text-left">
                  <span class="block">{{
                    t('hotels.bookingDetail.downloadVoucher')
                  }}</span>
                  <span
                    class="block text-[10px] font-normal opacity-80 mt-0.5"
                    >{{ t('hotels.bookingDetail.voucherSubtitle') }}</span
                  >
                </div>
              </UButton>

              <UButton
                block
                color="primary"
                variant="solid"
                icon="i-heroicons-document-currency-dollar-solid"
                class="font-bold justify-start py-3"
                @click="openDocument('invoice')"
              >
                <div class="text-left">
                  <span class="block">{{
                    t('hotels.bookingDetail.downloadInvoice')
                  }}</span>
                  <span
                    class="block text-[10px] font-normal opacity-90 mt-0.5"
                    >{{ t('hotels.bookingDetail.invoiceSubtitle') }}</span
                  >
                </div>
              </UButton>
            </div>

            <div class="mt-6 flex justify-center gap-4">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-arrow-left"
                class="text-gray-500 font-bold uppercase tracking-wider text-xs"
                @click="router.push('/dashboard/bookings')"
              >
                {{ t('hotels.bookingDetail.backToBookings') }}
              </UButton>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-magnifying-glass"
                class="text-gray-500 font-bold uppercase tracking-wider text-xs"
                @click="router.push('/dashboard')"
              >
                {{ t('hotels.bookingDetail.newSearch') }}
              </UButton>
            </div>
          </div>

          <!-- Other bookings in this order -->
          <UCard v-if="siblingBookings.length > 0" class="mt-6">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-squares-2x2"
                  class="w-4 h-4 text-primary-500"
                />
                <h3 class="font-semibold text-sm text-gray-900 dark:text-white">
                  {{ t('cart.orderGroup.title') }}
                  <span
                    class="text-gray-500 dark:text-gray-400 font-normal ml-1"
                  >
                    ({{ t('cart.orderGroup.orderRef') }}:
                    {{ siblingBookings[0]?.order_ref }})
                  </span>
                </h3>
              </div>
            </template>
            <div class="flex flex-col gap-2">
              <NuxtLink
                v-for="sibling in siblingBookings"
                :key="sibling.id"
                :to="`/dashboard/hotels/booking/${sibling.id}`"
                class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ sibling.hotel_name }}
                  </p>
                  <p class="text-xs text-gray-500 font-mono">
                    {{ sibling.pnr }}
                  </p>
                </div>
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="w-4 h-4 text-gray-400"
                />
              </NuxtLink>
            </div>
          </UCard>
        </div>

        <!-- Right Column: Hotel Summary (Reusing Sidebar) -->
        <div
          class="lg:col-span-1 border-gray-200 lg:border-l pl-0 lg:pl-8 mt-8 lg:mt-0"
        >
          <h3
            class="font-black tracking-tight text-gray-900 dark:text-white text-xl mb-4"
          >
            {{ t('hotels.bookingDetail.requestedDetail') }}
          </h3>
          <CheckoutSidebarSummary
            v-if="hotelProp && reservationProp"
            :hotel="hotelProp"
            :reservation="reservationProp"
            :total-price="parseFloat(booking.sell_rate)"
          />
        </div>
      </div>

      <!-- Voucher White-Label Modal -->
      <VoucherPreviewModal
        v-model:is-open="isVoucherModalOpen"
        :mode="documentMode"
        :booking-id="booking.pnr"
        :hotel-name="booking.hotel_snapshot?.name || ''"
        :reservation="reservationProp ?? emptyReservation"
      />
    </template>
  </div>
</template>
