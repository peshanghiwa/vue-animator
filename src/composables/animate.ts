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

const gestureAnimate = (
  animatingElement: HTMLElement,
  events: {
    eventName: string;
    callback: () => void;
  }[]
) => {
  events.forEach(({ eventName, callback }) => {
    animatingElement.addEventListener(eventName, () => callback());
  });
};

export const useAnimate = () => ({
  animate,
  gestureAnimate,
});
