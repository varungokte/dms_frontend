import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationPage from './components/AuthPages/RegistrationPage';
import LoginPage from './components/AuthPages/LoginPage';
import PrivateRoutes from './PrivateRoutes';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';


/* declare module '@mui/material/styles' {
  interface Palette {
    beacon: Palette['primary'];
  }

  interface PaletteOptions {
    beacon?: PaletteOptions['primary'];
  }
} */


function App() {
	//const {palette} = createTheme();

	const customColor = createTheme({
		palette: {
			secondary: { main: 'rgba(80, 65, 188, 1)' },
			//beacon: palette.augmentColor({color:{main:"rgba(80, 65, 188, 1)"}})
		},
	});

	return (
		<ThemeProvider theme={customColor}>
			<BrowserRouter>
				<Routes>
				<Route path="/register" element={<RegistrationPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/*' element={<PrivateRoutes />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
  )
}

export default App;