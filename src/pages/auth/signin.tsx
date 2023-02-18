import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoginForm, LoginFormSchema } from '@/lib/forms'
import { Alert, Button, Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/router'
import { useSession } from '@/lib/components/session'

const inter = Inter({ subsets: ['latin'] })

export default function SignIn() {
  const router = useRouter();
  const { setSession } = useSession();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const [error, setError] = useState<boolean>(false);

  const nextUrl = Array.isArray(router.query.from) ? router.query.from[0] : router.query.from;
  if (nextUrl) {
    // we're signed out, update session
    //setSession({ auth: false });
  }

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
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!resp.ok) {
        throw new Error(`${resp.status}: ${resp.statusText}`);
      }

      setSession({ auth: true });

      router.push(nextUrl ? nextUrl : '/');
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
