import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";

import RoomDistribution from "~/components/b2b/hotel/RoomDistribution.vue";

// Stub de UPopover que renderiza su default slot
const UPopoverStub = defineComponent({
  name: "UPopover",
  template: "<div><slot /></div>",
});

const UButtonStub = defineComponent({
  name: "UButton",
  template: "<button><slot /></button>",
});

describe("RoomDistribution trigger slot", () => {
  it("renders fallback UButton when no trigger slot provided", () => {
    const wrapper = mount(RoomDistribution, {
      global: {
        stubs: { UPopover: UPopoverStub, UButton: UButtonStub, UIcon: true },
      },
    });
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("renders custom trigger when #trigger slot is provided", () => {
    const wrapper = mount(RoomDistribution, {
      global: {
        stubs: { UPopover: UPopoverStub, UButton: UButtonStub, UIcon: true },
      },
      slots: {
        trigger: '<div data-testid="custom-trigger">Custom</div>',
      },
    });
    expect(wrapper.find('[data-testid="custom-trigger"]').exists()).toBe(true);
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("exposes summaryLabel as slot prop to trigger slot", () => {
    // Usar render function para scoped slots — template strings no soportan
    // destructuring de slot props en @vue/test-utils
    const wrapper = mount(RoomDistribution, {
      global: {
        stubs: { UPopover: UPopoverStub, UButton: UButtonStub, UIcon: true },
      },
      slots: {
        trigger: ({ label }: { label: string }) =>
          h("span", { "data-testid": "label" }, label),
      },
    });
    // Default composable state: 1 habitación, 2 adultos → summaryLabel incluye "1 Hab"
    expect(wrapper.find('[data-testid="label"]').text()).toContain("1 Hab");
  });
});
