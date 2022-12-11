<script lang="ts" setup>
import { onMounted, ref } from "vue";

interface Props extends EffectTiming {
  test?: string;
}
const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 1000,
  easing: "linear",
  endDelay: 0,
  fill: "none",
  iterationStart: 0,
  iterations: 1,
  direction: "normal",
  playbackRate: 1,
});

const KeyframeAnimationOptions = <KeyframeAnimationOptions>{
  delay: props.delay,
  duration: props.duration,
  easing: props.easing,
  endDelay: props.endDelay,
  fill: props.fill,
  iterationStart: props.iterationStart,
  iterations: props.iterations,
  direction: props.direction,
  playbackRate: props.playbackRate,
};
</script>
<template>
  <div id="animationElementWrapper">
    <slot ref="slot" />
  </div>
</template>
<style scoped>
#animationElementWrapper {
  display: inline-block;
}
</style>
