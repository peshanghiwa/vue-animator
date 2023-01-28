export const animate = (
  element: HTMLElement,
  keyframes: Keyframe[],
  effectTiming: EffectTiming
) => {
  const animationEffect: AnimationEffect = new KeyframeEffect(
    element,
    keyframes,
    effectTiming
  );

  const animation = new Animation(animationEffect);

  return animation;
};
