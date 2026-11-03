import { useEffect, useRef } from "react";

/**
 * Click-Outside Hook.
 *
 * Why this exists (PROJECT_STRUCTURE.md hooks/useOutsideAlert):
 * Automatically closes navigation drawers and modals when clicking outside.
 */
export function useOutsideAlert(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        cbRef.current();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

