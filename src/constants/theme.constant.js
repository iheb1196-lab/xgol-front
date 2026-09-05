import { createTheme } from "@mui/material/styles";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";
import colors from "tailwindcss/colors";

export const { theme: tailwindTheme } = resolveConfig(tailwindConfig);

const theme = createTheme({
  palette: {
    primary: {
      main: tailwindTheme.colors.primary.main,
      light: tailwindTheme.colors.primary.light,
    },
  },
});

export const tailwindColors = colors;

export default theme;
