import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RegistrationPage } from './components/Registration/RegistrationPage';
import { MenuRouter } from './MenuRouter';
import { LoginPage } from './components/Login/LoginPage';



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path='/*' element={<MenuRouter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;