<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useAnimate } from "../../composables/animate";
const { animate, fromTo } = useAnimate();
type KeyframeProp = {
  offset?: number;
  easing?: string;
  [key: string]: string | number | undefined;
};
type ComponentProps = {
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

const animatingElementParentRef = ref<HTMLElement>();

const animatingElementParent = computed(() => {
  const animatingElements = animatingElementParentRef.value?.children;
  if (!animatingElements) return; // if no children is specified, return an empty HTMLElement

  return animatingElements[0] as HTMLElement;
});

const animation = ref<Animation>();

const keyframes = computed(() =>
  fromTo(animatingElementParent.value, props.from, props.to)
);

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

const onAnimate = () => {
  const animatingElements = animatingElementParentRef.value?.children;
  if (!animatingElements) return;

  const animatingElement = animatingElements[0] as HTMLElement;

  animation.value = animate(
    animatingElement,
    keyframes.value,
    effectTiming.value
  );

  animation.value.play();
  // animationProcess(animation.value);
};

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
