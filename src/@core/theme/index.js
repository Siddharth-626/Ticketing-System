// Next Imports
import { Inter } from "next/font/google";
import { createTheme } from "@mui/material/styles";

// Theme Options Imports
import overrides from "./overrides";
import colorSchemes from "./colorSchemes";
import spacing from "./spacing";
import shadows from "./shadows";
import customShadows from "./customShadows";
import typography from "./typography";
import primaryColorConfig from "@/config/primaryColorConfig"; // Ensure the correct path

// Load Inter Font
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Theme function
const theme = (mode, direction) => {
  return createTheme({
    direction,
    palette: {
      mode, // Supports 'light' or 'dark'
      primary: {
        light: primaryColorConfig[0].light,
        main: primaryColorConfig[0].main,
        dark: primaryColorConfig[0].dark,
        contrastText: "#fff",
      },
      background: {
        default: mode === "dark" ? "#0d47a1" : "#e3f2fd", // Custom blue theme
        paper: mode === "dark" ? "#0b3d91" : "#bbdefb",
      },
      text: {
        primary: mode === "dark" ? "#bbdefb" : "#0d47a1",
        secondary: mode === "dark" ? "#e3f2fd" : "#1976d2",
      },
    },
    typography: typography(inter.style.fontFamily),
    components: overrides(),
    colorSchemes: colorSchemes(),
    ...spacing,
    shape: {
      borderRadius: 6,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10,
      },
    },
    shadows: shadows(mode),
    customShadows: customShadows(mode),
    mainColorChannels: {
      light: "46 38 61",
      dark: "231 227 252",
      lightShadow: "46 38 61",
      darkShadow: "19 17 32",
    },
  });
};

export default theme;
