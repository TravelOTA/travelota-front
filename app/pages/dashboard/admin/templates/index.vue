<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useItinerary, type Itinerary } from "~/composables/useItinerary";

definePageMeta({ layout: "dashboard" });

const { t } = useI18n();
const router = useRouter();
const { itinerary, clearItinerary } = useItinerary();
const toast = useToast();

// Mock initial templates
const templates = ref<Itinerary[]>([
  {
    id: "TPL-101",
    title: "Escapada Romántica Punta Cana (4 Noches)",
    clientName: "Plantilla Base",
    pax: 2,
    markupPercentage: 15,
    blocks: [
      {
        id: "BLK-A",
        title: "Alojamiento Todo Incluido",
        type: "hotel",
        date: "Día 1 al 4",
        options: [
          {
            id: "OPT-1",
            providerId: "H-882",
            name: "Iberostar WAVES DOMINICANA",
            description: "Suite Premium",
            image:
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            netPrice: 2454.66,
          },
          {
            id: "OPT-2",
            providerId: "H-111",
            name: "Serenade Punta Cana Beach",
            description: "Luxury tropical garden view",
            image:
              "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
            netPrice: 1041.33,
          },
        ],
      },
      {
        id: "BLK-B",
        title: "Traslado Aeropuerto - Hotel - Aeropuerto",
        type: "transfer",
        date: "Día 1 y 4",
        options: [
          {
            id: "OPT-3",
            providerId: "TR-99",
            name: "Van Privada Luxury",
            description: "Traslado directo privado con bebidas",
            image:
              "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            netPrice: 120.0,
          },
        ],
      },
    ],
  },
  {
    id: "TPL-102",
    title: "Tour Cultural Madrid y Barcelona (7 Días)",
    clientName: "Plantilla Base",
    pax: 2,
    markupPercentage: 12,
    blocks: [
      {
        id: "BLK-ES-1",
        title: "Hotel Centro Madrid",
        type: "hotel",
        date: "Días 1-3",
        options: [],
      },
      {
        id: "BLK-ES-2",
        title: "Tren AVE Madrid-Barcelona",
        type: "transfer",
        date: "Día 4",
        options: [],
      },
    ],
  },
]);

const search = ref("");
const filteredTemplates = computed(() => {
  return templates.value.filter((t) =>
    t.title.toLowerCase().includes(search.value.toLowerCase()),
  );
});

const loadTemplateIntoBuilder = (template: Itinerary) => {
  clearItinerary();
  // Deep clone to avoid mutating the template
  itinerary.value = JSON.parse(
    JSON.stringify({ ...template, id: undefined, clientName: "" }),
  );

  toast.add({
    title: t('admin.templates.toastMessage.title'),
    description: t('admin.templates.toastMessage.description'),
    color: "primary",
    icon: "i-heroicons-check-circle",
  });

  router.push("/dashboard/quoter/builder");
};
</script>

<template>
  <div class="max-w-7xl mx-auto pb-16">
    <!-- Admin Header -->
    <div
      class="bg-primary-900 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
    >
      <!-- Decorative background -->
      <div class="absolute top-0 right-0 p-8 opacity-10">
        <UIcon name="i-heroicons-document-duplicate" class="w-48 h-48" />
      </div>

      <div class="relative z-10">
        <UBadge
          color="neutral"
          variant="solid"
          class="mb-4 text-primary-900 font-bold uppercase tracking-wider"
        >
          {{ t('admin.templates.panelAdmin') }}
        </UBadge>
        <h1 class="text-3xl font-black mb-2">{{ t('admin.templates.title') }}</h1>
        <p class="text-primary-200 max-w-2xl text-lg mb-6">
          {{ t('admin.templates.subtitle') }}
        </p>

        <UButton
          color="neutral"
          variant="solid"
          size="lg"
          icon="i-heroicons-plus"
        >
          {{ t('admin.templates.createTemplate') }}
        </UButton>
      </div>
    </div>

    <!-- Template Directory -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        {{ t('admin.templates.directory') }}
      </h2>
      <div class="w-64">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass"
          :placeholder="t('admin.templates.searchPlaceholder')"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="tpl in filteredTemplates"
        :key="tpl.id"
        class="flex flex-col h-full hover:border-primary-500 transition-colors"
      >
        <div class="flex justify-between items-start mb-4">
          <UBadge color="neutral" variant="soft">{{ t('admin.templates.ref') }} {{ tpl.id }}</UBadge>
          <UDropdown
            :items="[
              [
                { label: t('admin.templates.dropdownMenu.edit'), icon: 'i-heroicons-pencil' },
                { label: t('admin.templates.dropdownMenu.deactivate'), icon: 'i-heroicons-archive-box' },
              ],
            ]"
          >
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal"
            />
          </UDropdown>
        </div>

        <h3
          class="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2"
        >
          {{ tpl.title }}
        </h3>

        <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span class="flex items-center gap-1"
            ><UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
            {{ tpl.blocks.length }} {{ t('admin.templates.blocks') }}</span
          >
          <span>•</span>
          <span class="flex items-center gap-1"
            ><UIcon name="i-heroicons-users" class="w-4 h-4" /> {{ t('admin.templates.pax') }}
            {{ tpl.pax }}</span
          >
        </div>

        <div
          class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2"
        >
          <UButton
            block
            color="neutral"
            variant="soft"
            class="flex-1"
            @click="loadTemplateIntoBuilder(tpl)"
          >
            {{ t('admin.templates.testClone') }}
          </UButton>
        </div>
      </UCard>

      <div
        v-if="filteredTemplates.length === 0"
        class="col-span-full py-12 text-center text-gray-500"
      >
        {{ t('admin.templates.noResults') }}
      </div>
    </div>
  </div>
</template>
