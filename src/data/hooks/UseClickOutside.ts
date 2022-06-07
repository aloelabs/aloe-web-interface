import { RefObject, useEffect } from 'react';

export default function useClickOutside(
  ref: RefObject<HTMLDivElement>,
  handler: () => void,
  shouldHandleClick: boolean = true
) {
  useEffect(() => {
    function listener(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }
    if (shouldHandleClick) {
      window.addEventListener('click', listener);
    }
    return () => {
      window.removeEventListener('click', listener);
    };
  }, [handler, ref, shouldHandleClick]);
}
