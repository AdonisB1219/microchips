import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuthStore } from '@/store/auth';

export const useIsSuperAdmin = () => {
    const navigate = useNavigate();
    const user = useAuthStore(s => s.user);

    useEffect(() => {
        if (!user?.rolId || user?.rolId < 4) {
            toast.error('No tienes permisos para ver esta página');
            navigate('/', { replace: true });
        }
    }, [navigate, user?.rolId]);

    return user && user?.rolId > 3;
};
