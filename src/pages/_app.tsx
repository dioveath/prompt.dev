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
import { useMemo, useState } from "react";
import { createTheme } from "@mui/material";
import { createContext } from "react";
import getDesignTokens from "@/config/theme";

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function App(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const appliedTheme = useMemo(
    () => createTheme(getDesignTokens(mode)),
    [mode]
  );

  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <link rel="manifest" href="site.webmanifest" />
            <link rel="apple-touch-icon" href="icon.png" />
            <link rel="icon" href="favicon.ico" />
            <meta name="description" content="A community for developers to share their ai tools, learn new skills, and connect with other fellows." />
            <meta name="keywords" content="ai, tools, developer, advert, showcase, community, projects, skills, connect, learn, share" />
            <meta name="author" content="Saroj Rai" />
            <title> prompters.dev </title>
          </Head>
          
          <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={appliedTheme}>
            <Toaster />
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
          </ColorModeContext.Provider>
          
        </CacheProvider>
      </ApolloProvider>
    </UserProvider>
  );
}
