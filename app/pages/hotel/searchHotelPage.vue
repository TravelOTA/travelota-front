<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-extrabold sm:text-4xl">
          Find Your Perfect Hotel
        </h1>
        <p class="mt-3 text-xl">Search among thousands of hotels worldwide</p>
      </div>

      <!-- Search Form -->
      <div class="rounded-lg shadow-xl p-6 md:p-8">
        <form class="space-y-6" @submit.prevent="handleSearch">
          <!-- Hotel Name -->
          <div>
            <label for="hotel-name" class="block text-sm font-medium mb-1">
              Hotel Name
            </label>
            <input
              id="hotel-name"
              v-model="searchForm.hotelName"
              type="text"
              placeholder="Enter hotel name (optional)"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Dates Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Entry Date -->
            <div>
              <label for="entry-date" class="block text-sm font-medium mb-1">
                Entry Date *
              </label>
              <input
                id="entry-date"
                v-model="searchForm.entryDate"
                type="date"
                :min="today"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                @change="updateCheckoutMinDate"
              />
            </div>

            <!-- Checkout Date -->
            <div>
              <label for="checkout-date" class="block text-sm font-medium mb-1">
                Checkout Date *
              </label>
              <input
                id="checkout-date"
                v-model="searchForm.checkoutDate"
                type="date"
                :min="minCheckoutDate"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                @change="calculateNights"
              />
            </div>
          </div>

          <!-- Nights (Auto-calculated) -->
          <div>
            <label class="block text-sm font-medium mb-1">
              Number of Nights
            </label>
            <div
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {{ searchForm.nights || 0 }} nights
            </div>
          </div>

          <!-- Room Distribution Button -->
          <div>
            <label class="block text-sm font-medium mb-1">
              Room Distribution *
            </label>
            <button
              type="button"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-left focus:ring-blue-500 focus:border-blue-500 transition-colors"
              @click="openRoomDialog"
            >
              <span v-if="totalRooms === 0"> Select rooms and guests </span>
              <span v-else>
                {{ roomSummary }}
              </span>
            </button>
          </div>

          <!-- Country -->
          <div>
            <label for="country" class="block text-sm font-medium mb-1">
              Country *
            </label>
            <select
              id="country"
              v-model="searchForm.country"
              required
              class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option
                value=""
                disabled
                class="text-black dark:text-white bg-white dark:bg-gray-800"
              >
                Select country
              </option>
              <option
                v-for="country in countries"
                :key="country.code"
                :value="country.code"
                class="text-black dark:text-white bg-white dark:bg-gray-800"
              >
                {{ country.name }}
              </option>
            </select>
          </div>

          <!-- Search Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isSearching || !isFormValid"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isSearching">Search Hotels</span>
              <span v-else class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching...
              </span>
            </button>
          </div>
        </form>
      </div>

      <!-- Room Distribution Dialog -->
      <div
        v-if="showRoomDialog"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="room-dialog-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-opacity-50 transition-opacity"
          @click="showRoomDialog = false"
        ></div>

        <!-- Dialog panel -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-xl transition-all sm:w-full sm:max-w-2xl"
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 id="room-dialog-title" class="text-lg font-medium">
                  Room Distribution
                </h3>
                <button
                  class="hover:text-gray-500"
                  @click="showRoomDialog = false"
                >
                  <span class="sr-only">Close</span>
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Room List -->
            <div class="px-6 py-4 max-h-96 overflow-y-auto">
              <div
                v-for="(room, index) in roomDistribution"
                :key="index"
                class="mb-6 last:mb-0"
              >
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-md font-medium">Room {{ index + 1 }}</h4>
                  <button
                    v-if="roomDistribution.length > 1"
                    class="text-red-500 hover:text-red-700 text-sm"
                    @click="removeRoom(index)"
                  >
                    Remove
                  </button>
                </div>

                <div class="grid grid-cols-3 gap-4">
                  <!-- Adults -->
                  <div>
                    <label
                      :for="'adults-' + index"
                      class="block text-xs font-medium mb-1"
                    >
                      Adults (18+)
                    </label>
                    <select
                      :id="'adults-' + index"
                      v-model.number="room.adults"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option
                        v-for="n in 4"
                        :key="n"
                        :value="n"
                        class="text-black dark:text-white bg-white dark:bg-gray-800"
                      >
                        {{ n }}
                      </option>
                    </select>
                  </div>

                  <!-- Kids -->
                  <div>
                    <label
                      :for="'kids-' + index"
                      class="block text-xs font-medium mb-1"
                    >
                      Kids (0-17)
                    </label>
                    <select
                      :id="'kids-' + index"
                      v-model.number="room.kids"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option
                        v-for="n in 5"
                        :key="n"
                        :value="n - 1"
                        class="text-black dark:text-white bg-white dark:bg-gray-800"
                      >
                        {{ n - 1 }}
                      </option>
                    </select>
                  </div>

                  <!-- Total (display only) -->
                  <div>
                    <label class="block text-xs font-medium mb-1">
                      Total
                    </label>
                    <div
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      {{ room.adults + room.kids }} guests
                    </div>
                  </div>
                </div>

                <!-- Kids Ages (if kids > 0) -->
                <div
                  v-if="room.kids > 0"
                  class="mt-3 pl-4 border-l-2 border-blue-200"
                >
                  <p class="text-xs font-medium mb-2">Ages of children:</p>
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="kidIndex in room.kids"
                      :key="kidIndex"
                      class="flex items-center"
                    >
                      <label
                        :for="'room-' + index + '-kid-' + kidIndex"
                        class="text-xs mr-1"
                      >
                        Child {{ kidIndex }}:
                      </label>
                      <select
                        :id="'room-' + index + '-kid-' + kidIndex"
                        v-model.number="room.kidsAges[kidIndex - 1]"
                        class="w-20 px-2 py-1 border border-gray-300 rounded-md text-xs"
                      >
                        <option v-for="age in 17" :key="age" :value="age">
                          {{ age }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <!-- Summary -->
                <div class="text-sm">
                  <span class="font-medium">Total:</span>
                  {{ totalRooms }} {{ totalRooms === 1 ? "room" : "rooms" }},
                  {{ totalGuests }} guests ({{ totalAdults }} adults,
                  {{ totalKids }} kids)
                </div>

                <div class="flex space-x-3">
                  <button
                    class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
                    @click="addRoom"
                  >
                    + Add Room
                  </button>
                  <!-- <button
                    @click="clearRoomDistribution"
                    class="px-4 py-2 text-sm font-medium hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Clear
                  </button> -->
                  <button
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    @click="saveRoomDistribution"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Search Modal -->
      <div
        v-if="isSearching"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        ></div>

        <!-- Modal panel -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-md"
          >
            <button
              class="absolute top-3 right-3 hover:text-gray-500"
              @click="cancelSearch"
            >
              <span class="sr-only">Close</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div class="bg-white px-6 py-8">
              <div class="text-center">
                <div class="flex justify-center mb-4">
                  <svg
                    class="animate-spin h-12 w-12 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>

                <h3 id="modal-title" class="text-lg font-medium leading-6 mb-2">
                  Searching for Hotels
                </h3>

                <div class="mt-2">
                  <p class="text-sm mb-4">
                    Please wait while we find the best hotels for your stay
                  </p>

                  <div class="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                    <p class="text-sm">
                      <span class="font-medium">Hotel:</span>
                      {{ searchForm.hotelName || "Any" }}
                    </p>
                    <p class="text-sm">
                      <span class="font-medium">Check-in:</span>
                      {{ formatDate(searchForm.entryDate) }}
                    </p>
                    <p class="text-sm">
                      <span class="font-medium">Check-out:</span>
                      {{ formatDate(searchForm.checkoutDate) }}
                    </p>
                    <p class="text-sm">
                      <span class="font-medium">Nights:</span>
                      {{ searchForm.nights }}
                    </p>
                    <p class="text-sm">
                      <span class="font-medium">Guests:</span>
                      {{ totalRooms }} rooms, {{ totalGuests }} guests
                    </p>
                    <p class="text-sm">
                      <span class="font-medium">NCountry:</span>
                      {{ getCountryName(searchForm.country) }}
                    </p>
                  </div>
                </div>

                <div class="mt-4">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      class="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      :style="{ width: searchProgress + '%' }"
                    ></div>
                  </div>
                  <p class="text-xs mt-2">{{ searchProgress }}% complete</p>
                </div>

                <button
                  class="mt-4 text-sm hover:text-gray-700"
                  @click="cancelSearch"
                >
                  Cancel search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Success/Error Messages -->
      <div v-if="message" class="mt-4">
        <div
          :class="[
            'rounded-md p-4',
            messageType === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800',
          ]"
        >
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

definePageMeta({
  layout: "default",
});

// Form state
const searchForm = ref({
  hotelName: "",
  entryDate: "",
  checkoutDate: "",
  nights: 0,
  country: "",
});

// Room distribution state
const showRoomDialog = ref(false);
const roomDistribution = ref([{ adults: 1, kids: 0 }]);

// UI state
const isSearching = ref(false);
const searchProgress = ref(0);
const message = ref("");
const messageType = ref("success");
const searchTimeout = ref(null);
const progressInterval = ref(null);

// Computed properties for room distribution
const totalRooms = computed(() => roomDistribution.value.length);

const totalAdults = computed(() => {
  return roomDistribution.value.reduce((sum, room) => sum + room.adults, 0);
});

const totalKids = computed(() => {
  return roomDistribution.value.reduce((sum, room) => sum + room.kids, 0);
});

const totalGuests = computed(() => {
  return totalAdults.value + totalKids.value;
});

const roomSummary = computed(() => {
  if (totalRooms.value === 0) return "";

  const roomText = `${totalRooms.value} ${totalRooms.value === 1 ? "room" : "rooms"}`;
  const guestText = `${totalGuests.value} ${totalGuests.value === 1 ? "guest" : "guests"}`;
  return `${roomText}, ${guestText} (${totalAdults.value} adults, ${totalKids.value} kids)`;
});

// Get today's date for min attribute
const today = computed(() => {
  const date = new Date();
  return date.toISOString().split("T")[0];
});

// Minimum checkout date (entry date + 1 day)
const minCheckoutDate = computed(() => {
  if (!searchForm.value.entryDate) return today.value;

  const date = new Date(searchForm.value.entryDate);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
});

// Form validation
const isFormValid = computed(() => {
  return (
    searchForm.value.entryDate &&
    searchForm.value.checkoutDate &&
    totalRooms.value > 0 &&
    searchForm.value.country
  );
});

// Room distribution methods
const openRoomDialog = () => {
  showRoomDialog.value = true;
};

const addRoom = () => {
  roomDistribution.value.push({ adults: 1, kids: 0, kidsAges: [] });
};

const removeRoom = (index) => {
  roomDistribution.value.splice(index, 1);
};

// const clearRoomDistribution = () => {
//   roomDistribution.value = []
//   showRoomDialog.value = false
//   message.value = ''
// }

const saveRoomDistribution = () => {
  // Validate each room has proper kids ages
  roomDistribution.value.forEach((room) => {
    if (room.kids > 0 && room.kidsAges.length !== room.kids) {
      // Initialize kids ages if not set
      room.kidsAges = Array(room.kids)
        .fill(1)
        .map((_, i) => room.kidsAges[i] || 1);
    }
  });
  showRoomDialog.value = false;
};

// Watch for kids count changes to update kidsAges array
watch(
  roomDistribution,
  (newRooms) => {
    newRooms.forEach((room) => {
      if (room.kids !== room.kidsAges.length) {
        if (room.kids > room.kidsAges.length) {
          // Add new ages
          const additionalAges = Array(room.kids - room.kidsAges.length).fill(
            1,
          );
          room.kidsAges = [...room.kidsAges, ...additionalAges];
        } else {
          // Remove extra ages
          room.kidsAges = room.kidsAges.slice(0, room.kids);
        }
      }
    });
  },
  { deep: true },
);

// Update checkout min date when entry date changes
const updateCheckoutMinDate = () => {
  if (
    !searchForm.value.checkoutDate ||
    searchForm.value.checkoutDate < minCheckoutDate.value
  ) {
    searchForm.value.checkoutDate = minCheckoutDate.value;
  }
  calculateNights();
};

// Calculate nights between dates
const calculateNights = () => {
  if (searchForm.value.entryDate && searchForm.value.checkoutDate) {
    const entry = new Date(searchForm.value.entryDate);
    const checkout = new Date(searchForm.value.checkoutDate);
    const diffTime = Math.abs(checkout - entry);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    searchForm.value.nights = diffDays;
  } else {
    searchForm.value.nights = 0;
  }
};

// Watch for date changes to recalculate nights
watch(
  () => [searchForm.value.entryDate, searchForm.value.checkoutDate],
  () => {
    calculateNights();
  },
);

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "Not selected";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Get country name from code
const getCountryName = (code) => {
  if (!code) return "Not selected";
  const country = countries.value.find((c) => c.code === code);
  return country ? country.name : code;
};

// Countries list
const countries = ref(
  [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "ES", name: "Spain" },
    { code: "IT", name: "Italy" },
  ].sort((a, b) => a.name.localeCompare(b.name)),
);

// Handle search
const handleSearch = async () => {
  if (!isFormValid.value) {
    message.value = "Please fill in all required fields";
    messageType.value = "error";
    return;
  }

  message.value = "";
  isSearching.value = true;
  searchProgress.value = 0;

  progressInterval.value = setInterval(() => {
    if (searchProgress.value < 90) {
      searchProgress.value += 10;
    }
  }, 300);

  searchTimeout.value = setTimeout(() => {
    if (progressInterval.value) {
      clearInterval(progressInterval.value);
    }
    searchProgress.value = 100;

    setTimeout(() => {
      isSearching.value = false;
      searchProgress.value = 0;
      message.value = "Search completed! (Results would appear here)";
      messageType.value = "success";
    }, 500);
  }, 3000);
};

// Clean up timeouts on component unmount
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  if (progressInterval.value) {
    clearInterval(progressInterval.value);
  }
});
</script>
