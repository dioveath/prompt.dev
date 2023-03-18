import { Inter, Karla } from "next/font/google";
import { AppProps } from "next/app";
import { NextUIProvider, createTheme, theme } from "@nextui-org/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import "@/styles/globals.css";

const primaryFont = Inter({
  subsets: ["latin"],
  variable: "--primary-font",
});

const lightTheme = createTheme({ type: "light" });
const darkTheme = createTheme({ type: "dark" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextThemeProvider defaultTheme="light" attribute="class" value={{
      light: lightTheme.className,
      dark: darkTheme.className
    }}>
      <NextUIProvider>
        <main className={`${primaryFont.variable} font-sans`}>
          <Component {...pageProps} />
        </main>
      </NextUIProvider>
    </NextThemeProvider>
  );
}
