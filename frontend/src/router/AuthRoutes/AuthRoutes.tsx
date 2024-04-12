import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/store/auth';

export interface AuthRoutesProps {
  children: React.ReactNode;
}

const AuthRoutes: React.FC<AuthRoutesProps> = ({ children }) => {
  const isAuth = useAuthStore(s => s.isAuth);

  return !isAuth ? children : <Navigate to="/dashboard/home" replace />;
};

export default AuthRoutes;
