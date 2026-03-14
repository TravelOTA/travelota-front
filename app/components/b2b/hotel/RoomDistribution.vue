<script setup lang="ts">
import { ref, computed } from "vue";
import type { SearchRoomDistribution } from "~/composables/useItinerary";

const rooms = defineModel<SearchRoomDistribution[]>({
  default: () => [{ adults: 2, children: [] }],
});

const isOpen = ref(false);
const expandedRooms = ref<number[]>([0]);

// Summary label for the trigger button
const summaryLabel = computed(() => {
  const totalRooms = rooms.value.length;
  const totalAdults = rooms.value.reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = rooms.value.reduce(
    (sum, r) => sum + r.children.length,
    0,
  );

  let label = `${totalRooms} Hab`;
  label += ` · ${totalAdults} Adulto${totalAdults > 1 ? "s" : ""}`;
  if (totalChildren > 0) {
    label += ` · ${totalChildren} Niño${totalChildren > 1 ? "s" : ""}`;
  }
  return label;
});

// Room count controls
const addRoom = () => {
  if (rooms.value.length < 6) {
    rooms.value.push({ adults: 2, children: [] });
    expandedRooms.value.push(rooms.value.length - 1);
  }
};

const removeRoom = () => {
  if (rooms.value.length > 1) {
    rooms.value.pop();
    expandedRooms.value = expandedRooms.value.filter(
      (i) => i < rooms.value.length,
    );
  }
};

// Adults controls per room
const incrementAdults = (roomIdx: number) => {
  const room = rooms.value[roomIdx];
  if (room && room.adults < 6) {
    room.adults++;
  }
};

const decrementAdults = (roomIdx: number) => {
  const room = rooms.value[roomIdx];
  if (room && room.adults > 1) {
    room.adults--;
  }
};

// Children controls per room
const addChild = (roomIdx: number) => {
  const room = rooms.value[roomIdx];
  if (room && room.children.length < 4) {
    room.children.push({ age: 5 });
  }
};

const removeChild = (roomIdx: number) => {
  const room = rooms.value[roomIdx];
  if (room && room.children.length > 0) {
    room.children.pop();
  }
};

// Toggle room accordion
const toggleRoom = (idx: number) => {
  const pos = expandedRooms.value.indexOf(idx);
  if (pos >= 0) {
    expandedRooms.value.splice(pos, 1);
  } else {
    expandedRooms.value.push(idx);
  }
};
</script>

<!-- REFACTOR: Room Distribution could be displayed via UModal. -->
<template>
  <UPopover v-model:open="isOpen" class="w-full">
    <!-- Trigger: slot con fallback para compatibilidad con consumidores existentes.
         IMPORTANTE: los consumidores deben usar #trigger (no v-slot/#default),
         ya que #default es el slot de trigger del UPopover padre. -->
    <slot name="trigger" :label="summaryLabel" :open="isOpen">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-heroicons-users"
        size="md"
        class="w-full justify-start font-normal"
      >
        {{ summaryLabel }}
      </UButton>
    </slot>

    <!-- Popover Content — sin cambios -->
    <template #content>
      <div class="w-80 p-4">
        <!-- Number of rooms -->
        <div
          class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700"
        >
          <span class="text-sm text-gray-600 dark:text-gray-400">
            Número de habitaciones
          </span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              :disabled="rooms.length <= 1"
              @click="removeRoom"
            >
              <UIcon name="i-heroicons-minus" class="w-4 h-4" />
            </button>
            <span
              class="w-6 text-center font-semibold text-gray-900 dark:text-white"
            >
              {{ rooms.length }}
            </span>
            <button
              type="button"
              class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              :disabled="rooms.length >= 6"
              @click="addRoom"
            >
              <UIcon name="i-heroicons-plus" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Per-room configuration -->
        <div class="max-h-[400px] overflow-y-auto">
          <div
            v-for="(room, roomIdx) in rooms"
            :key="roomIdx"
            class="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          >
            <!-- Room header (accordion toggle) -->
            <button
              type="button"
              class="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              @click="toggleRoom(roomIdx)"
            >
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-home" class="w-4 h-4 text-gray-500" />
                <span
                  class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide"
                >
                  Habitación {{ roomIdx + 1 }}
                </span>
              </div>
              <UIcon
                name="i-heroicons-chevron-up"
                class="w-4 h-4 text-gray-400 transition-transform"
                :class="{
                  'rotate-180': !expandedRooms.includes(roomIdx),
                }"
              />
            </button>

            <!-- Room details (expandable) -->
            <div v-if="expandedRooms.includes(roomIdx)" class="pb-3 space-y-3">
              <!-- Adults row -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  Adultos
                </span>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    :disabled="room.adults <= 1"
                    @click="decrementAdults(roomIdx)"
                  >
                    <UIcon name="i-heroicons-minus" class="w-4 h-4" />
                  </button>
                  <span
                    class="w-6 text-center font-semibold text-gray-900 dark:text-white"
                  >
                    {{ room.adults }}
                  </span>
                  <button
                    type="button"
                    class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    :disabled="room.adults >= 6"
                    @click="incrementAdults(roomIdx)"
                  >
                    <UIcon name="i-heroicons-plus" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Children row -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  Niños
                </span>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    :disabled="room.children.length <= 0"
                    @click="removeChild(roomIdx)"
                  >
                    <UIcon name="i-heroicons-minus" class="w-4 h-4" />
                  </button>
                  <span
                    class="w-6 text-center font-semibold text-gray-900 dark:text-white"
                  >
                    {{ room.children.length }}
                  </span>
                  <button
                    type="button"
                    class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    :disabled="room.children.length >= 4"
                    @click="addChild(roomIdx)"
                  >
                    <UIcon name="i-heroicons-plus" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Child age selectors -->
              <div
                v-for="(child, childIdx) in room.children"
                :key="childIdx"
                class="flex items-center justify-between pl-3 border-l-2 border-gray-200 dark:border-gray-700"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  Edad niño {{ childIdx + 1 }}
                </span>
                <select
                  v-model.number="child.age"
                  class="w-20 h-8 px-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option v-for="age in 18" :key="age - 1" :value="age - 1">
                    {{ age - 1 }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>
