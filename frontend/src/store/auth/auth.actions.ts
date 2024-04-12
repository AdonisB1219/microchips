import { useMutation } from '@tanstack/react-query';

import { appAPI } from '@/shared/axios';
import { LoginResponse } from '@/shared/interfaces';
import { toast } from 'react-toastify';
import { useAuthStore } from '.';

const { post } = appAPI();

export type LoginData = {
  username_or_email: string;
  password: string;
};

export const useLogin = () => {
  const setAuth = useAuthStore(s => s.setAuth);
  const setUser = useAuthStore(s => s.setUser);
  // const logOutWithoutToken = useAuthStore(s => s.logOutWithoutToken);

  return useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess: async res => {
      const { token, user } = res;
      setAuth(token);
      setUser(user);
      toast.success('Inicio de sesión exitoso!');
    },
    onError: () => {
      toast.error(
        'Error al iniciar sesión, por favor verifica tus credenciales e intenta de nuevo.'
      );
    },
  });
};

export const login = async (data: LoginData) =>
  post<LoginResponse>(
    '/auth/login',
    {
      email: data.username_or_email,
      password: data.password,
    },
    false
  );
