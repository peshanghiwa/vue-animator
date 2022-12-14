<script setup lang="ts">
import Animation from "./components/Animation.vue";
</script>

<template>
  <Animation>
  <Animation
    :keyframes="[
      { backgroundColor: 'transparent' },
      { backgroundColor: 'red' },
      { backgroundColor: 'blue' },
      { backgroundColor: 'green' },
      { backgroundColor: 'yellow' },
      { backgroundColor: 'transparent' },
    ]"
    :iterations="3"
  >
    <div>test</div>
  </Animation>
</template>

<style scoped></style>
