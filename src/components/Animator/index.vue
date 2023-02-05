<script lang="ts" setup>
// -------
// Imports
// -------
import { computed, onMounted, ref, watch } from "vue";
import { useAnimate } from "../../composables/animate";
const { animate, fromTo } = useAnimate();

// ---------------
// Component Props
// ---------------
type KeyframeProp = {
  offset?: number;
  easing?: string;
  [key: string]: string | number | undefined;
};
type ComponentProps = {
  modelValue?: boolean;
  autoStart?: boolean;
  from?: KeyframeProp;
  to: KeyframeProp | KeyframeProp[];
  tag?: string;

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
  if (!animatingElements) return; // if no children is specified, return an empty HTMLElement

  return animatingElements[0] as HTMLElement;
});

const animation = ref<Animation>();

// -----------------
// Keyframes Configs
// -----------------
const keyframes = computed(() =>
  fromTo(animatingElement.value, props.from, props.to)
);

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
  if (!animatingElement.value) return;

  animation.value = animate(
    animatingElement.value,
    keyframes.value,
    effectTiming.value
  );

  animation.value.play();
  emits("start");

  // animation.value.onfinish = () => {
  //   emits("update:model-value", false);
  // };
};

watch(
  () => props.modelValue,
  (value) => {
    console.log("watching modelValue", value);

    if (value) onAnimate();
  }
);

onMounted(() => {
  if (props.autoStart) {
    onAnimate();
  }
});

// type AnimationProps = {
//   // custom props
//   keyframes: SingleKeyframe | MultipleKeyframes;
//   modelValue?: boolean;
//   resetAfterEnd?: boolean;

// };
// const props = withDefaults(defineProps<AnimationProps>(), {
//   // custom props
//   modelValue: false,
//   resetAfterEnd: false,

// });

// const interval = ref<number>();

// const emit = defineEmits([
//   "update:modelValue",
//   "beforeStart",
//   "afterEnd",
//   "cancel",
//   "running",
// ]);

// const animate = () => {
//   const animatingElements = animatingElementParentRef.value?.children;
//   if (!animatingElements) return;

//   for (let i = 0; i < animatingElements.length; i++) {
//     const animatingElement = animatingElements[i];

//     const keyframeEffectConfigs = new KeyframeEffect(
//       animatingElement,
//       keyframes.value,
//       keyframeOptions.value
//     );

//     animation.value = new Animation(keyframeEffectConfigs);
//     animationProcess(animation.value);
//   }
// };

// const animationProcess = async (animation: Animation) => {
//   try {
//     emit("beforeStart");
//     emit("running", 0);
//     animation.play();
//     interval.value = setInterval(() => {
//       if (animation?.playState === "running")
//         emit("running", Number(animation.currentTime?.toFixed(2)));
//       else clearInterval(interval.value);
//     }, 10);
//     animation.addEventListener("finish", () => {
//       emit("running", Number(animation?.currentTime?.toFixed(2)));
//       emit("update:modelValue", false);
//     });
//     await animation.finished;
//     if (props.resetAfterEnd) emit("update:modelValue", false);
//     emit("afterEnd");
//   } catch (error) {}
// };
// watch(
//   () => props.modelValue,
//   (value) => {
//     if (value) animate();
//     else {
//       if (animation.value?.playState === "running") {
//         animation.value?.cancel();
//         emit("cancel");
//       }
//     }
//   }
// );

onMounted(() => {
  onAnimate();
});
</script>
<template>
  <component :is="tag" ref="animatingElementParentRef">
    <slot />
  </component>
</template>
