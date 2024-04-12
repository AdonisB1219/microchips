import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const usePathname = (): string => {
  const { pathname } = useLocation();

  return useMemo(() => pathname, [pathname]);
};
