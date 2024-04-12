import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

import { CustomTextField } from '@/shared/components';
import { loginFormSchema } from '@/shared/utils';
import { useLogin } from '@/store/auth';
import { useState } from 'react';

export interface LoginPageInterface {}

type LoginFormData = {
  username_or_email: string;
  password: string;
};

const LoginPage: React.FC<LoginPageInterface> = () => {
  const [showPassword, setShowPassword] = useState(false);

  ///* mutations
  const loginMutation = useLogin();

  ///* form
  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginFormSchema),
  });
  const {
    handleSubmit,
    formState: { errors: loginByEmailErros, isValid: isValidLoginData },
  } = form;

  ///* handlers
  const onSubmit = (data: LoginFormData) => {
    if (!isValidLoginData) return;

    loginMutation.mutate(data);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        flex: '1 1 auto',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 550,
          px: 3,
          py: '100px',
          width: '100%',
        }}
      >
        <div>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h4">Iniciar sesión</Typography>
          </Stack>

          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ padding: '0px 9px 0px 0px', minWidth: '100%' }}>
              <Grid item container spacing={3} justifyContent="center">
                <Stack
                  spacing={3}
                  sx={{
                    width: '100%',
                    p: 3,
                  }}
                >
                  <CustomTextField
                    label="Username o Email"
                    // errors
                    control={form.control}
                    name="username_or_email"
                    defaultValue={form.getValues().username_or_email}
                    error={loginByEmailErros.username_or_email}
                    helperText={loginByEmailErros.username_or_email?.message}
                    required={false}
                    type="email"
                  />
                  <CustomTextField
                    label="Contraseña"
                    name="password"
                    overrideAsPassword // avoid uppercase in text mode
                    control={form.control}
                    defaultValue={form.getValues().password}
                    error={form.formState.errors.password}
                    helperText={form.formState.errors.password?.message}
                    type={showPassword ? 'text' : 'password'}
                    endAdornmentInput={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <MdVisibilityOff />
                          ) : (
                            <MdVisibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Stack>

                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 2, mx: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Iniciar sesión
                </Button>
              </Grid>
            </Box>
          </form>
        </div>
      </Box>
    </Box>
  );
};

export default LoginPage;
