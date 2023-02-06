<script setup lang="ts">
import { ref } from "vue";
import { Animator } from ".";
const animate = ref(false);
</script>

<template>
  <div class="test-container">
    <Animator
      v-model="animate"
      :transitions="{ fill: 'forwards' }"
      reversible
      :to="[
        {
          scale: 2,
          rotate: '270deg',
          borderRadius: '50%',
        },
      ]"
    >
      <div class="test"></div>
    </Animator>
  </div>
  <div class="button-parent">
    <button @click="animate = true">play</button>
    <button @click="animate = false">stop</button>
    <h1>
      {{ animate ? "played" : "stopped" }}
    </h1>
  </div>
</template>

<style scoped>
.test-container {
  width: 100%;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.test {
  width: 100px;
  height: 100px;
  background-color: blue;
}

.button-parent {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}
</style>
