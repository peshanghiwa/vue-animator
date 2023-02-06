const getAllDefaultStylesFromElement = (
  keyframes: Keyframe | Keyframe[],
  element: HTMLElement
): Keyframe[] => {
  const keyframesArray = Array.isArray(keyframes) ? keyframes : [keyframes];
  const keys = keyframesArray.reduce((keyframes, currentKeyframe) => {
    return [...keyframes, ...Object.keys(currentKeyframe)];
  }, [] as string[]);

  const computedStyles = getComputedStyle(element);
  let computedStylesObj: Keyframe = {};

  keys.forEach((key) => {
    if (key === "offset" || key === "easing") return; // we skip offset and easing as they are not css properties in this case
    computedStylesObj[key] = computedStyles[key as any] as string | number;
  });

  return [computedStylesObj];
};

const animate = (
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

export const useAnimate = () => ({
  animate,
});
