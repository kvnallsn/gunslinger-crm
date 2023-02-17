import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Container, Typography } from '@mui/material'
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSession } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
          <Typography>Welcome</Typography>
        </Container>
      </main>
    </>
  )
}
