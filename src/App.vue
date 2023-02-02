<script setup lang="ts">
import { Animator } from ".";
</script>

<template>
  <Animator
    :to="[
      {
        transform: 'translateX(100px)',
        backgroundColor: 'red',
      },
    ]"
  >
    <div>test</div>
  </Animator>
</template>

<style scoped></style>
