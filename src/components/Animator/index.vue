<script lang="ts" setup>
// -------
// Imports
// -------
import { computed, onMounted, ref, watch } from "vue";
import type { TransitionType } from "./types";
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
  onHover?: Keyframe | Keyframe[];
  tag?: string;
  reversible?: boolean;
  transitions?: TransitionType;
  hoverTransitions?: TransitionType;
};

const props = withDefaults(defineProps<ComponentProps>(), {
  tag: "div",
  autoStart: false,
  modelValue: false,
  resetAfterEnd: false,
  reversible: false,
});

const defaultTransitions = computed<TransitionType>(() => ({
  duration: 1000,
  easing: "ease",
  ...props.transitions,
}));

const defaultHoverTransitions = computed<TransitionType>(() => ({
  duration: 500,
  easing: "ease",
  fill: "forwards",
  ...props.hoverTransitions,
}));

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
  const fromKeyframe = props.from ? props.from : {};
  const toKeyframes = Array.isArray(props.to) ? props.to : [props.to];

  return [fromKeyframe, ...toKeyframes];
});

const hoverKeyframes = computed<Keyframe[]>(() => {
  if (!props.onHover) return [];

  const fromKeyframe = props.from ? props.from : {};
  const toKeyframes = Array.isArray(props.onHover)
    ? props.onHover
    : [props.onHover];

  return [fromKeyframe, ...toKeyframes];
});
// ---------------------
// Effect Timing Configs
// ---------------------
const effectTiming = computed<EffectTiming>(() => ({
  duration: defaultTransitions.value.duration,
  iterations: defaultTransitions.value.iterations,
  delay: defaultTransitions.value.delay,
  easing: defaultTransitions.value.easing,
  endDelay: defaultTransitions.value.endDelay,
  fill: defaultTransitions.value.fill,
  iterationStart: defaultTransitions.value.iterationStart,
  direction: defaultTransitions.value.direction,
  playbackRate: defaultTransitions.value.playbackRate,
}));

// -----------------
// Animation Process
// -----------------
const onAnimate = (
  keyframesArg: Keyframe[] = keyframes.value,
  effectTimingArg: EffectTiming = effectTiming.value
) => {
  // preapre the animation
  animation.value = animate(
    animatingElement.value as HTMLElement,
    keyframesArg,
    effectTimingArg
  );

  // start the animation
  animation.value.play();
  emits("start");

  // listen for animation end
  animation.value.onfinish = () => {
    emits("end");
    if (props.resetAfterEnd) emits("update:model-value", false);
  };
};

const onReverseAnimate = () => {
  if (!animation.value) return;
  // // start the animation
  animation.value?.reverse();
  emits("start");
};

const onHoverAnimate = () => {
  animatingElement.value?.addEventListener("mouseenter", () =>
    onAnimate(hoverKeyframes.value, defaultHoverTransitions.value)
  );

  animatingElement.value?.addEventListener("mouseleave", () =>
    onReverseAnimate()
  );
};

// -----------------
// Watchers & Effects
// -----------------
watch(
  () => props.modelValue,
  (value) => {
    if (value) onAnimate();
    else {
      if (animation.value?.playState === "running") {
        animation.value?.cancel();
        emits("update:model-value", false);
        emits("cancel");
      }
      if (props.reversible) onReverseAnimate();
    }
  }
);

// -----------------
// Lifecycle Methods
// -----------------
onMounted(() => {
  // Check if the slot element exists
  if (!animatingElement.value)
    throw new Error("No element specified in the slot");

  // start the animation if autoStart is true or modelValue is true
  if (props.autoStart || props.modelValue) onAnimate();

  // start hover animation if onHover is specified
  if (props.onHover) onHoverAnimate();
});
</script>
<template>
  <component :is="tag" ref="animatingElementParentRef">
    <slot />
  </component>
</template>
