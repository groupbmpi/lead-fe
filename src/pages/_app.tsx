import { RegistrationProvider } from '@/contexts/RegistrationContext';
import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { NextUIProvider } from '@nextui-org/react'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RegistrationProvider>
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </RegistrationProvider>
    </>
  )
}
