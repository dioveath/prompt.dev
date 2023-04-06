import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "@/lib/createEmotionCache";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ApolloProvider } from "@apollo/client/react";
import apolloClient from "../../lib/apollo";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";
import Head from "next/head";
import theme from "@/config/theme";
import dynamic from "next/dynamic";
// const HelmetMetaData = dynamic(() => import('@/sections/helmetmetadata'), { ssr: false });
import HelmetMetaData from "@/sections/helmetmetadata";
import SEOHead from "@/components/seo";

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <Toaster />
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </ApolloProvider>
    </UserProvider>
  );
}
