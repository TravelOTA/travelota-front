<script setup lang="ts">
import { Motion } from 'motion-v';

const { t } = useI18n();
</script>

<template>
  <section class="py-24 bg-white dark:bg-gray-950">
    <div class="px-4 lg:px-8 mx-auto max-w-7xl">
      <div class="flex flex-col lg:flex-row items-center gap-16">
        <Motion
          as="div"
          class="flex-1 space-y-8"
          :initial="{ opacity: 0, x: -40 }"
          :while-in-view="{ opacity: 1, x: 0 }"
          :viewport="{ once: true }"
          :transition="{ duration: 0.7, ease: 'easeOut' }"
        >
          <h2
            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase"
          >
            {{ t('auth.landing.bedBankTitle') }}
          </h2>
          <div class="w-16 h-1 bg-primary rounded-full"></div>

          <ul class="space-y-6 text-lg text-gray-600 dark:text-gray-400">
            <li class="flex items-start gap-4">
              <UIcon
                name="i-lucide-check-circle-2"
                class="w-6 h-6 text-primary shrink-0 mt-1"
              />
              <span>
                {{ t('auth.landing.bedBankBullet1Prefix') }}
                <strong>{{ t('auth.landing.bedBankBullet1Highlight') }}</strong>
                {{ t('auth.landing.bedBankBullet1Suffix') }}
              </span>
            </li>
            <li class="flex items-start gap-4">
              <UIcon
                name="i-lucide-check-circle-2"
                class="w-6 h-6 text-primary shrink-0 mt-1"
              />
              <span>
                {{ t('auth.landing.bedBankBullet2Prefix') }}
                <strong>{{ t('auth.landing.bedBankBullet2Highlight') }}</strong>
                {{ t('auth.landing.bedBankBullet2Suffix') }}
              </span>
            </li>
            <li class="flex items-start gap-4">
              <UIcon
                name="i-lucide-check-circle-2"
                class="w-6 h-6 text-primary shrink-0 mt-1"
              />
              <span>{{ t('auth.landing.bedBankBullet3') }}</span>
            </li>
          </ul>

          <div class="pt-4">
            <UButton
              size="xl"
              color="primary"
              variant="solid"
              class="group shadow-lg shadow-primary/30"
            >
              {{ t('auth.landing.bedBankCta') }}
              <template #trailing>
                <UIcon
                  name="i-lucide-arrow-right"
                  class="group-hover:translate-x-1 transition-transform"
                />
              </template>
            </UButton>
          </div>
        </Motion>

        <Motion
          as="div"
          class="flex-1 relative"
          :initial="{ opacity: 0, x: 40 }"
          :while-in-view="{ opacity: 1, x: 0 }"
          :viewport="{ once: true }"
          :transition="{ duration: 0.7, delay: 0.15, ease: 'easeOut' }"
        >
          <div class="aspect-square max-w-md mx-auto relative">
            <div
              class="absolute inset-0 bg-primary/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-70"
            ></div>
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop"
              class="rounded-3xl shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 relative z-10 object-cover w-full h-full"
              :alt="t('auth.landing.bedBankImageAlt')"
            />
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
