import { Inter } from "next/font/google";
import { AppProps } from "next/app";
import { NextUIProvider, createTheme, theme } from "@nextui-org/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ApolloProvider } from "@apollo/client/react";
import apolloClient from "../../lib/apollo";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";

const primaryFont = Inter({
  subsets: ["latin"],
  variable: "--primary-font",
});

const lightTheme = createTheme({ type: "light" });
const darkTheme = createTheme({ type: "dark" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <NextThemeProvider defaultTheme="light" attribute="class" value={{
          light: lightTheme.className,
          dark: darkTheme.className
        }}>
          <NextUIProvider>
            <Toaster/>
            <main className={`${primaryFont.variable} font-sans`}>
              <Component {...pageProps} />
            </main>
          </NextUIProvider>
        </NextThemeProvider>
      </ApolloProvider>
    </UserProvider>
  );
}
