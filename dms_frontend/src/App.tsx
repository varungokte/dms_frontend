import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { RegistrationPage } from './components/Registration/RegistrationPage';
import { MenuRouter } from './MenuRouter';
import { LoginPage } from './components/Login/LoginPage';
import { useEffect, useState } from 'react';
import useGlobalContext from "../GlobalContext";


function App() {
  const [logged, setLogged] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem("Beacon-DMS-token");
    const { isLoggedIn } = useGlobalContext();
    if (isLoggedIn()){
      setLogged(true)
    }
  },[])
/* 
  if (!logged)
    return (
    <BrowserRouter>
      <Link to="/login">LOGIN PAGE</Link>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
    ); */

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<MenuRouter />} />
      </Routes>
    </BrowserRouter> 
  )
}

export default App;