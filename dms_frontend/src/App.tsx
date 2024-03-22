import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { RegistrationPage } from './components/Registration/RegistrationPage';
import { MenuRouter } from './MenuRouter';
import { LoginPage } from './components/Login/LoginPage';
import { useEffect, useState } from 'react';
import useGlobalContext from "../GlobalContext";


function App() {
  const { isLoggedIn } = useGlobalContext();

  useEffect(() => {
    isLoggedIn();
  }, [])

  if (!isLoggedIn())
    return (
      <BrowserRouter>
        {/* <Link to="/login">LOGIN PAGE</Link> */}
        <Routes>
          <Route path="/register" element={<RegistrationPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<MenuRouter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;


//can the same person be a maker in a certain transation and checker in another 

// enter the name of zone 

// enter the name of product 

// is a transaction assigned to a person or a document 