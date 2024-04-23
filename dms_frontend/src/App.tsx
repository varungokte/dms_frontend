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


/*   Loan_Basic
  |1|**Basic Details**||
  
   AID-Agreement Id
   Z-Zone
        1:West
        2:South 
        3:East 
        4:North
   
   CN- Company Name
   I- Industry
        1:Real Estate
        2:NBFC 
        3:NBFC-MFI 
        4:Bank 
        5:Diversified Conglomerate 
        6:Education 
        7:Healthcare & Pharma 
        8:Hospitality Manufacturing 
        9:Renewable Energy 
        10:Roads 
        11:Commercial Space 
        12:Others
   
   SA-Sanctioned Amount
   HA-Hold Amount
   DA-Downsell Amount(Auto  SA-HA)
   DD-Downsell Date
   PS-Project Status
   
   OA-Outstanding Amount
   T-Loan Type
        1:Long Term
        2:Short Term
   
   P- Loan Product
        1:Term Loan
        2:Drop-line LOC
        3:WCDL
        4:Debentures
   
   ST- Security Types
        1:Secured
        2:Unsecured
        3:Deemed Secured
   
   SD-Sanctioned Date
   CD-Closure Date
   RED- Repayment End Date
   
   DSRA-Debt Service Reserve Account {A,F,S,V}
        A- Applicability DSRA
            1:yes
            2:no
        F- Form DSRA
        S- Status DSRA
            1:yes
            2:no
        V- Value DSRA
   
  
  |2|**Security Details**||
  
   S-Share(%)
   DV-Date of Valuation
   STV:Security Type and Value [{T1,V1},{T2,V2}]
       T Type
            1:Security creation 
            2:MIS 
            3:Financials 
            4:Put/Call Option 
            5:Financial Covenants 
            6:End Use
            7:Others
       
       V- Value
  
  |3|**Bank Details**||
   AN-Account Name
   BAN-Bank Account Number
   AT-Account Type
   LB-Location of Branch 
   BN-Bank Name
   BA-Branch Address
   IFSC-Indian Financial System Code
 */  

/* 
User Status
1 - Unverified
2 - Active
3 - Inactive
*/