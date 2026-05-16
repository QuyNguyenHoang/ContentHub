import { useEffect} from "react";
import type { RefObject } from "react";
export default function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (!ref.current?.contains(target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [ref, callback]);
}