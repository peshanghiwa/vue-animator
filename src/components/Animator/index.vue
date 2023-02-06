<script lang="ts" setup>
// -------
// Imports
// -------
import { computed, onMounted, ref, watch } from "vue";
import { useAnimate } from "../../composables/animate";
const { animate } = useAnimate();

// ---------------
// Component Props
// ---------------

type ComponentProps = {
  // custom props
  modelValue?: boolean;
  autoStart?: boolean;
  resetAfterEnd?: boolean;
  from?: Keyframe;
  to: Keyframe | Keyframe[];
  tag?: string;

  // default animation props
  delay?: number;
  direction?: PlaybackDirection;
  duration?: number | string;
  easing?: string;
  endDelay?: number;
  fill?: FillMode;
  iterationStart?: number;
  iterations?: number;
  playbackRate?: number;
};

const props = withDefaults(defineProps<ComponentProps>(), {
  tag: "div",
  autoStart: false,
  modelValue: false,
  resetAfterEnd: false,

  delay: 0,
  direction: "normal",
  duration: 2000,
  easing: "linear",
  endDelay: 0,
  fill: "none",
  iterationStart: 0,
  iterations: 1,
  playbackRate: 1,
});

// ----------------
// Component Events
// ----------------
const emits = defineEmits<{
  (event: "update:model-value", value: boolean): void;
  (event: "start"): void;
  (event: "end"): void;
  (event: "cancel"): void;
}>();

// --------------------------------
// Animating Element Parent Configs
// --------------------------------
const animatingElementParentRef = ref<HTMLElement>();

const animatingElement = computed(() => {
  const animatingElements = animatingElementParentRef.value?.children;
  if (!animatingElements) return; // if no children is specified, return undifined.

  return animatingElements[0] as HTMLElement; // return the first child element only as this is a single Animator.
});

const animation = ref<Animation>();

// -----------------
// Keyframes Configs
// -----------------
const keyframes = computed<Keyframe[]>(() => {
  const from = props.from ? [props.from] : []; // if from is not specified, return an empty array.
  const to = Array.isArray(props.to) ? props.to : [props.to];

  return [...from, ...to];
});

// ---------------------
// Effect Timing Configs
// ---------------------
const effectTiming = computed<EffectTiming>(() => ({
  duration: props.duration,
  iterations: props.iterations,
  delay: props.delay,
  easing: props.easing,
  endDelay: props.endDelay,
  fill: props.fill,
  iterationStart: props.iterationStart,
  direction: props.direction,
  playbackRate: props.playbackRate,
}));

// -----------------
// Animation Process
// -----------------
const onAnimate = () => {
  if (!animatingElement.value) return; // if no animating element is specified, stop the function.

  // preapre the animation
  animation.value = animate(
    animatingElement.value,
    keyframes.value,
    effectTiming.value
  );

  // start the animation
  animation.value.play();
  emits("start");

  // listen for animation end
  animation.value.onfinish = () => {
    if (props.resetAfterEnd) emits("update:model-value", false);
    emits("end");
  };
};

watch(
  () => props.modelValue,
  (value) => {
    if (value) onAnimate();
    else {
      if (animation.value?.playState === "running") {
        animation.value?.cancel();
        emits("cancel");
      }
    }
  }
);

onMounted(() => {
  // Check if the slot element exists
  if (!animatingElement.value)
    throw new Error("No element specified in the slot");

  if (props.autoStart || props.modelValue) {
    onAnimate();
  }
});
</script>
<template>
  <component :is="tag" ref="animatingElementParentRef">
    <slot />
  </component>
</template>
