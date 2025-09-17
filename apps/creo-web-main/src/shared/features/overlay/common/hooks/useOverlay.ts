import { usePathname, useRouter } from 'next/navigation';
import { useOverlayStore } from './useOverlayStore';
import { useEffect } from 'react';

export default function useOverlay() {
    const overlay = useOverlayStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (overlay.isOpen) {
        router.push(`${pathname}?o=true&op=${overlay.module + ':' + overlay.section + ':' + overlay.subsection}`);
      } else {
        router.push(pathname);
      }
    }, [
      overlay.isOpen,
      overlay.module,
      overlay.section,
      overlay.subsection,
      pathname,
      router
    ]);
    

  return {
    ...overlay
  }
}
