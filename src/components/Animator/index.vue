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
const fromKeyframe = computed<Keyframe>(() => props.from ?? {});

const modelValueKeyframes = computed<Keyframe[]>(() => {
  const toKeyframes = Array.isArray(props.to) ? props.to : [props.to];

  return [fromKeyframe.value, ...toKeyframes];
});

const hoverKeyframes = computed<Keyframe[]>(() => {
  if (!props.onHover) return [];

  const toKeyframes = Array.isArray(props.onHover)
    ? props.onHover
    : [props.onHover];

  return [fromKeyframe.value, ...toKeyframes];
});

const clickKeyframes = computed<Keyframe[]>(() => {
  if (!props.onClick) return [];

  const toKeyframes = Array.isArray(props.onClick)
    ? props.onClick
    : [props.onClick];

  return [fromKeyframe.value, ...toKeyframes];
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

// -----------------
// Gesture Animations
// -----------------
const eventListenersAnimate = (
  animatingElement: HTMLElement,
  events: {
    eventName: string;
    callback: () => void;
  }[]
) => {
  events.forEach(({ eventName, callback }) => {
    animatingElement.addEventListener(eventName, () => {
      if (props.modelValue) return;
      callback();
    });
  });
};

const onHoverAnimate = () => {
  eventListenersAnimate(animatingElement.value as HTMLElement, [
    {
      eventName: "mouseenter",
      callback: () => onAnimate(hoverKeyframes.value, hoverTransitions.value),
    },
    {
      eventName: "mouseleave",
      callback: () => onReverseAnimate(),
    },
  ]);
};

const mouseDown = ref(false);
const onClickAnimate = () => {
  eventListenersAnimate(animatingElement.value as HTMLElement, [
    {
      eventName: "mousedown",
      callback: () => {
        onAnimate(clickKeyframes.value, clickTransitions.value);
        mouseDown.value = true;
      },
    },
    {
      eventName: "mouseup",
      callback: () => {
        mouseDown.value ? onReverseAnimate() : null;
        mouseDown.value = false;
      },
    },
    {
      eventName: "mouseleave",
      callback: () => {
        mouseDown.value ? onReverseAnimate() : null;
        mouseDown.value = mouseDown.value ? false : mouseDown.value;
      },
    },
  ]);
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

      // if reversible is true, reverse the animation when modalValue is false
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
  ["mouseenter", "mouseleave", "mousedown", "mouseup", "mouseleave"].forEach(
    (eventName) => {
      animatingElement.value?.removeEventListener(eventName, () => {});
    }
  );
});

const test = () => {
  console.log("helloo");
};
</script>
<template>
  <component :is="tag" ref="animatingElementParentRef">
    <slot @mouseenter="test" />
  </component>
</template>
