<script lang="ts" setup>
import { isArray } from "@vue/shared";
import { computed, onMounted, ref, watch } from "vue";

interface SingleKeyframe {
  from: Partial<CSSStyleDeclaration>;
  to: Partial<CSSStyleDeclaration>;
}

interface MultipleKeyframes {
  [key: string]: Partial<CSSStyleDeclaration>;
}

interface AnimationProps {
  // custom props
  keyframes: SingleKeyframe | MultipleKeyframes[];
  tag?: string;
  modelValue?: boolean;

  // animation props
  delay?: number;
  direction?: PlaybackDirection;
  duration?: number | string;
  easing?: string;
  endDelay?: number;
  fill?: FillMode;
  iterationStart?: number;
  iterations?: number;
  playbackRate?: number;
}

const props = withDefaults(defineProps<AnimationProps>(), {
  // custom props
  tag: "div",
  modelValue: false,

  // animation props
  iterations: 1,
  delay: 0,
  direction: "normal",
  duration: 1000,
  easing: "linear",
  endDelay: 0,
  fill: "none",
  iterationStart: 0,
  playbackRate: 1,
});

const emit = defineEmits(["update:modelValue"]);

const animationContainerElement = ref<HTMLElement>();
const animation = ref<Animation>();
const keyframes = computed(
  () =>
    isArray(props.keyframes)
      ? <Keyframe[]>props.keyframes // animation is multiple keyframes
      : <Keyframe[]>[props.keyframes.from, props.keyframes.to] // animation is single keyframe
);

const keyframeOptions = computed(
  () =>
    <KeyframeAnimationOptions>{
      duration: props.duration,
      iterations: props.iterations,
      delay: props.delay,
      easing: props.easing,
      endDelay: props.endDelay,
      fill: props.fill,
      iterationStart: props.iterationStart,
      direction: props.direction,
      playbackRate: props.playbackRate,
    }
);

const animate = async () => {
  try {
    const animatingElement = animationContainerElement.value?.firstElementChild;
    if (!animatingElement) return;

    const keyframeEffectConfigs = new KeyframeEffect(
      animatingElement,
      keyframes.value,
      keyframeOptions.value
    );

    animation.value = new Animation(keyframeEffectConfigs);

    animation.value.play();

    await animation.value.finished;
    emit("update:modelValue", false);
  } catch (error) {}
};

watch(
  () => props.modelValue,
  (value) => {
    console.log("modelValue changed", value);

    if (value) animate();
    else animation.value?.cancel();
  }
);

onMounted(() => {
  props.modelValue && animate();
});
</script>
<template>
  <component :is="tag" ref="animationContainerElement">
    <slot />
  </component>
</template>
