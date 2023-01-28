<script lang="ts" setup>
// import { isArray } from "@vue/shared";
// import { computed, onMounted, ref, watch } from "vue";

// type AnimationKeyframe = Partial<CSSStyleDeclaration>;

// type SingleKeyframe = {
//   from: AnimationKeyframe;
//   to: AnimationKeyframe;
// };

// type MultipleKeyframes = AnimationKeyframe[];

// type AnimationProps = {
//   // custom props
//   keyframes: SingleKeyframe | MultipleKeyframes;
//   tag?: string;
//   modelValue?: boolean;
//   resetAfterEnd?: boolean;

//   // animation props
//   delay?: number;
//   direction?: PlaybackDirection;
//   duration?: number | string;
//   easing?: string;
//   endDelay?: number;
//   fill?: FillMode;
//   iterationStart?: number;
//   iterations?: number;
//   playbackRate?: number;
// };
// const props = withDefaults(defineProps<AnimationProps>(), {
//   // custom props
//   tag: "div",
//   modelValue: false,
//   resetAfterEnd: false,

//   // animation props
//   iterations: 1,
//   delay: 0,
//   direction: "normal",
//   duration: 1000,
//   easing: "linear",
//   endDelay: 0,
//   fill: "none",
//   iterationStart: 0,
//   playbackRate: 1,
// });

// const interval = ref<number>();

// const emit = defineEmits([
//   "update:modelValue",
//   "beforeStart",
//   "afterEnd",
//   "cancel",
//   "running",
// ]);

// const animationContainerElement = ref<HTMLElement>();
// const animation = ref<Animation>();
// const keyframes = computed(
//   () =>
//     isArray(props.keyframes)
//       ? <Keyframe[]>props.keyframes // animation is multiple keyframes
//       : <Keyframe[]>[props.keyframes.from, props.keyframes.to] // animation is single keyframe
// );

// const keyframeOptions = computed(
//   () =>
//     <KeyframeAnimationOptions>{
//       duration: props.duration,
//       iterations: props.iterations,
//       delay: props.delay,
//       easing: props.easing,
//       endDelay: props.endDelay,
//       fill: props.fill,
//       iterationStart: props.iterationStart,
//       direction: props.direction,
//       playbackRate: props.playbackRate,
//     }
// );

// const animate = () => {
//   const animatingElements = animationContainerElement.value?.children;
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

// onMounted(() => {
//   props.modelValue && animate();
// });
</script>
<template>
  <!-- <component :is="tag" ref="animationContainerElement">
    <slot />
  </component> -->
</template>
