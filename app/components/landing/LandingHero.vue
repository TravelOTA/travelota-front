<script setup lang="ts">
import { Motion } from "motion-v";
</script>

<template>
  <section class="relative bg-gray-900 overflow-hidden">
    <div class="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2674&auto=format&fit=crop"
        class="w-full h-full object-cover opacity-60 mix-blend-overlay"
        alt="Viajes"
      />
      <div
        class="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40"
      ></div>
    </div>

    <div class="relative px-4 py-24 sm:py-32 lg:px-8 mx-auto max-w-7xl">
      <div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
        <!-- LEFT CONTENT -->
        <Motion
          as="div"
          class="flex-1 text-center lg:text-left"
          :initial="{ opacity: 0, x: -40 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.7, ease: 'easeOut' }"
        >
          <h1
            class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md uppercase"
          >
            <span class="block">Somos tu</span>
            <span class="block text-primary-400">Mayorista</span>
            <span class="block">De Viajes</span>
          </h1>
          <div
            class="mt-4 w-16 h-1 bg-primary mx-auto lg:mx-0 rounded-full"
          ></div>
          <p
            class="mt-6 text-xl text-gray-200 font-medium drop-shadow max-w-3xl mx-auto lg:mx-0"
          >
            Operador turístico líder para Agencias de Viaje
          </p>
        </Motion>

        <!-- RIGHT CONTENT: LOGIN CARD -->
        <Motion
          as="div"
          class="w-full max-w-md"
          :initial="{ opacity: 0, x: 40 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.7, delay: 0.2, ease: 'easeOut' }"
        >
          <AuthLoginForm />
        </Motion>
      </div>
    </div>
  </section>
</template>
