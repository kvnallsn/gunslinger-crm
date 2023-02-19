import React, { useState } from 'react'
import Head from 'next/head'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoginForm, LoginFormSchema } from '@/lib/forms'
import { Alert, Button, Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const [error, setError] = useState<boolean>(false);

  // form delcaration
  const { handleSubmit, control } = useForm<LoginForm>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(LoginFormSchema)
  });

  const onSubmit: SubmitHandler<LoginForm> = async data => {
    setError(false);
    try {
      const r = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (r && r.ok) {
        let next = '/';
        if (r.url) {
          const n = new URL(r.url);
          next = n.searchParams.get('callbackURL') || '/';
        }

        router.push(next);
      } else {
        throw new Error(r ? r.error : 'authentication failed');
      }

    } catch (err: any) {
      setError(true);
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>Gunslinger CRM</title>
        <meta name="description" content="Engagement tracking for Gunslingers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container sx={{ maxWidth: 'sm' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Paper elevation={3} sx={{ mx: 2, my: 6, p: 2 }}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12}>
                  <Typography variant='h5' sx={{ textAlign: 'center' }}>Login</Typography>
                </Grid>

                {error &&
                  <Grid item xs={12}>
                    <Alert severity='error'>Invalid username/password</Alert>
                  </Grid>
                }

                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        type='email'
                        error={Boolean(error)}
                        helperText={error && error.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        error={Boolean(error)}
                        helperText={error && error.message}
                        InputProps={{
                          endAdornment:
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='toggle password visibility'
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge='end'
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type='submit' variant='contained' fullWidth>Log In</Button>
                </Grid>
              </Grid>
            </Paper>
          </form>
        </Container>
      </main>
    </>
  )
}
