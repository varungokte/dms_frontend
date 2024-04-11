import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RegistrationPage } from './components/Registration/RegistrationPage';
import { LoginPage } from './components/Login/LoginPage';
import PrivateRoutes from './PrivateRoutes';
import VerificationComponent from './components/VerificationComponent';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/verify" element={<VerificationComponent/>} />
        <Route path='/*' element={<PrivateRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;


//can the same person be a maker in a certain transation and checker in another 

// enter the name of zone 

// enter the name of product 

// is a transaction assigned to a person or a document 