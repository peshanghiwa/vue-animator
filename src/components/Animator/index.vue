<script lang="ts" setup>
// -------
// Imports
// -------
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
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
  onClick?: Keyframe | Keyframe[];
  tag?: string;
  reversible?: boolean;
  transitions?: TransitionType;
  hoverTransitions?: TransitionType;
  clickTransitions?: TransitionType;
};

const props = withDefaults(defineProps<ComponentProps>(), {
  tag: "div",
  autoStart: false,
  modelValue: false,
  resetAfterEnd: false,
  reversible: false,
});

const modelValueTransitions = computed<TransitionType>(() => ({
  duration: 1000,
  easing: "ease",
  ...props.transitions,
}));

const hoverTransitions = computed<TransitionType>(() => ({
  duration: 500,
  easing: "ease",
  fill: "forwards",
  ...props.hoverTransitions,
}));

const clickTransitions = computed<TransitionType>(() => ({
  duration: 100,
  easing: "ease",
  fill: "forwards",
  ...props.clickTransitions,
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

const modelValueKeyframes = computed<Keyframe[]>(() => {
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

const clickKeyframes = computed<Keyframe[]>(() => {
  if (!props.onClick) return [];

  const fromKeyframe = props.from ? props.from : {};
  const toKeyframes = Array.isArray(props.onClick)
    ? props.onClick
    : [props.onClick];

  return [fromKeyframe, ...toKeyframes];
});

// ---------------------
// Effect Timing Configs
// ---------------------
const effectTiming = computed<EffectTiming>(() => ({
  duration: modelValueTransitions.value.duration,
  iterations: modelValueTransitions.value.iterations,
  delay: modelValueTransitions.value.delay,
  easing: modelValueTransitions.value.easing,
  endDelay: modelValueTransitions.value.endDelay,
  fill: modelValueTransitions.value.fill,
  iterationStart: modelValueTransitions.value.iterationStart,
  direction: modelValueTransitions.value.direction,
  playbackRate: modelValueTransitions.value.playbackRate,
}));

// -----------------
// Animation Process
// -----------------
const onAnimate = (
  keyframesArg: Keyframe[] = modelValueKeyframes.value,
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
    onAnimate(hoverKeyframes.value, hoverTransitions.value)
  );

  animatingElement.value?.addEventListener("mouseleave", () =>
    onReverseAnimate()
  );
};

const mouseDown = ref(false);
const onClickAnimate = () => {
  animatingElement.value?.addEventListener("mousedown", (e) => {
    onAnimate(clickKeyframes.value, clickTransitions.value);
    mouseDown.value = true;
  });

  animatingElement.value?.addEventListener("mouseup", (e) => {
    mouseDown.value ? onReverseAnimate() : null;
    mouseDown.value = false;
  });

  animatingElement.value?.addEventListener("mouseleave", (e) => {
    mouseDown.value ? onReverseAnimate() : null;
    mouseDown.value = mouseDown.value ? false : mouseDown.value;
  });
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
        //! check props.reversible before cancelling the animation
        animation.value?.cancel();
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

  // start click animation if onClick is specified
  if (props.onClick) onClickAnimate();
});

onUnmounted(() => {
  // remove event listeners
  animatingElement.value?.removeEventListener("mouseenter", () => {});
  animatingElement.value?.removeEventListener("mouseleave", () => {});
  animatingElement.value?.removeEventListener("mousedown", () => {});
  animatingElement.value?.removeEventListener("mouseup", () => {});
  animatingElement.value?.removeEventListener("mouseleave", () => {});
});
</script>
<template>
  <component :is="tag" ref="animatingElementParentRef">
    <slot />
  </component>
</template>
