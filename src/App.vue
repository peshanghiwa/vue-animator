<script setup lang="ts">
import { Animator } from ".";
</script>

<template>
  <div class="test-container">
    <Animator
      :delay="1000"
      :to="[
        {
          scale: 2,
          rotate: '0deg',
          borderRadius: '20%',
        },
        {
          scale: 2,
          rotate: '270deg',
          borderRadius: '50%',
        },
        {
          scale: 1,
          rotate: '270deg',
          borderRadius: '50%',
        },
        {
          scale: 1,
          rotate: '0deg',
          borderRadius: '20%',
        },
      ]"
    >
      <div class="test"></div>
    </Animator>
  </div>
</template>

<style scoped>
.test-container {
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.test {
  width: 100px;
  height: 100px;
  background-color: blue;
}
</style>
