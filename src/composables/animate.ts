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
    computedStylesObj[key] = computedStyles[key as any] as string | number;
  });

  return [computedStylesObj];
};

const fromTo = (
  element: HTMLElement,
  fromArg: Keyframe | undefined,
  toArg: Keyframe | Keyframe[]
) => {
  let from, to;

  from = fromArg ?? getAllDefaultStylesFromElement(toArg, element);
  to = toArg;

  return [...(from as any[]), ...(to as any[])] as Keyframe[];
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
  fromTo,
  animate,
});
