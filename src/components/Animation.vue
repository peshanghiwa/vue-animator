<script lang="ts" setup>
import { isArray } from "@vue/shared";
import { onMounted, ref } from "vue";

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

const animationContainerElement = ref<HTMLElement>();

const animate = () => {
  const animatingElement = animationContainerElement.value?.firstElementChild;
  if (!animatingElement) return;

  const keyframes = isArray(props.keyframes)
    ? <Keyframe[]>props.keyframes
    : <Keyframe[]>[props.keyframes.from, props.keyframes.to];

  const keyframeOptions = <KeyframeAnimationOptions>{
    duration: props.duration,
    iterations: props.iterations,
    delay: props.delay,
    easing: props.easing,
    endDelay: props.endDelay,
    fill: props.fill,
    iterationStart: props.iterationStart,
    direction: props.direction,
    playbackRate: props.playbackRate,
  };

  const keyframeEffectConfigs = new KeyframeEffect(
    animatingElement,
    keyframes,
    keyframeOptions
  );

  const animation = new Animation(keyframeEffectConfigs);

  animation.play();
};

onMounted(animate);
</script>
<template>
  <component :is="tag" ref="animationContainerElement">
    <slot />
  </component>
</template>
