
import { createTheme } from '@mui/material/styles';

const {palette} = createTheme();

export const customColor = createTheme({
  palette: {
    secondary: {
      main: 'rgba(80, 65, 188, 1)',
    },
		beacon: palette.augmentColor({color:{main:"rgba(80, 65, 188, 1)"}})
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    beacon: Palette['primary'];
  }

  interface PaletteOptions {
    beacon?: PaletteOptions['primary'];
  }
}