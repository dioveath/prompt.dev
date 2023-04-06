import { Roboto, Raleway, IBM_Plex_Sans } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { PaletteMode } from "@mui/material";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const raleway = Raleway({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const ibmPlexSans = IBM_Plex_Sans({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Helvetica", "Arial", "sans-serif"],
});

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light" && {
      primary: {
        main: "#635cfe",
      },
      secondary: {
        main: "#19857b",
      },
      error: {
        main: red.A400,
      },
      background: {
        default: "#efefef",
      },
    }),
    ...(mode === "dark" && {
        primary: {
            main: '#635cfe',
        },
        background: {
            default: '#101010',
        }
    })
  },
  typography: {
    fontFamily: ibmPlexSans.style.fontFamily,
  },
});

export default getDesignTokens;
