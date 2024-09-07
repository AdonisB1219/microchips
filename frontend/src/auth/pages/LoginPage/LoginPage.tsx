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
import { useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';

export interface LoginPageInterface { }

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
    if (!captcha.current || !captcha.current.getValue()) {
      toast.error('Debes marcar la casilla "No soy un robot"');
      return;
    }

    loginMutation.mutate(data);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const captcha = useRef(null);

  const onChange = () => {
  }


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

                <ReCAPTCHA
                  ref={captcha}
                  sitekey="6LcaJM0pAAAAAPjBwZPKM1eB5z7nilfdJK4oZREf"
                  onChange={onChange}
                />

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
