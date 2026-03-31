import { computed } from "vue";
import { apiFetch } from "~/composables/useApi";
import { useItinerary, type Itinerary } from "~/composables/useItinerary";

export interface ItineraryTemplate {
  id: number;
  scope: "personal" | "agency" | "platform";
  name: string;
  description: string;
  destination: string;
  itinerary: Itinerary;
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaveTemplatePayload {
  name: string;
  description: string;
  destination: string;
  scope: ItineraryTemplate["scope"];
}

export interface UpdateTemplatePayload {
  name?: string;
  description?: string;
  destination?: string;
}

export const useTemplates = () => {
  const templates = useState<ItineraryTemplate[]>("quoter-templates", () => []);
  const { itinerary, clearItinerary } = useItinerary();

  const personalTemplates = computed(() =>
    templates.value.filter((t) => t.scope === "personal"),
  );
  const agencyTemplates = computed(() =>
    templates.value.filter((t) => t.scope === "agency"),
  );
  const platformTemplates = computed(() =>
    templates.value.filter((t) => t.scope === "platform"),
  );

  const fetchTemplates = async (): Promise<void> => {
    const data = await apiFetch<ItineraryTemplate[]>(
      "/api/quotation/templates",
    );
    templates.value = data;
  };

  const saveTemplate = async (payload: SaveTemplatePayload): Promise<void> => {
    // Strip options from all blocks; clear clientName
    const skeleton: Itinerary = {
      ...itinerary.value,
      clientName: "",
      blocks: itinerary.value.blocks.map((block) => ({
        ...block,
        options: [],
      })),
    };

    const created = await apiFetch<ItineraryTemplate>(
      "/api/quotation/templates",
      {
        method: "POST",
        body: { ...payload, itinerary: skeleton },
      },
    );

    templates.value = [created, ...templates.value];
  };

  const updateTemplate = async (
    id: number,
    payload: UpdateTemplatePayload,
  ): Promise<void> => {
    const updated = await apiFetch<ItineraryTemplate>(
      `/api/quotation/templates/${id}`,
      { method: "PATCH", body: payload },
    );
    templates.value = templates.value.map((t) => (t.id === id ? updated : t));
  };

  const deleteTemplate = async (id: number): Promise<void> => {
    await apiFetch(`/api/quotation/templates/${id}`, { method: "DELETE" });
    templates.value = templates.value.filter((t) => t.id !== id);
  };

  const loadTemplateIntoBuilder = (template: ItineraryTemplate): void => {
    clearItinerary();
    itinerary.value = {
      ...template.itinerary,
      clientName: "",
      // give each block a fresh UUID so the builder treats them as new
      blocks: template.itinerary.blocks.map((block) => ({
        ...block,
        id: crypto.randomUUID(),
      })),
    };
  };

  return {
    templates,
    personalTemplates,
    agencyTemplates,
    platformTemplates,
    fetchTemplates,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    loadTemplateIntoBuilder,
  };
};
