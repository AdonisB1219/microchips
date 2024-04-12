import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/store/auth';

export interface PrivateRoutesProps {
  children: React.ReactNode;
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ children }) => {
  const isAuth = useAuthStore(s => s.isAuth);

  return !isAuth ? <Navigate to="/" replace /> : children;
};

export default PrivateRoutes;
