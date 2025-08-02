import { useRef, useEffect, RefObject } from "react";

interface UseAutoScrollOptions {
  /**
   * The dependency that triggers the scroll effect.
   * Whenever this value changes, the scroll will be triggered.
   */
  dependency: any;
}

/**
 * A custom hook that provides auto-scrolling behavior to a container.
 *
 * @param options - The configuration options for the hook.
 * @returns A RefObject that should be attached to the scroll target element.
 */
// THE FIX: The return type is changed from `RefObject<T>` to `RefObject<T | null>`.
// This now accurately reflects the type returned by `useRef` when initialized with `null`.
export const useAutoScroll = <T extends HTMLElement>({
  dependency,
}: UseAutoScrollOptions): RefObject<T | null> => {
  // `useRef<T>(null)` creates a ref whose `.current` can be `T` or `null`.
  const scrollTargetRef = useRef<T>(null);

  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dependency]);

  return scrollTargetRef;
};
