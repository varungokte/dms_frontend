import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationPage from './components/AuthPages/RegistrationPage';
import LoginPage  from './components/AuthPages/LoginPage';
import PrivateRoutes from './PrivateRoutes';

function App() {
  return (
     	<BrowserRouter>
				<Routes>
				<Route path="/register" element={<RegistrationPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/*' element={<PrivateRoutes />} />
				</Routes>
     </BrowserRouter>
  )
}

export default App;


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
 
 |4|**Contact Details**||
  BID-Business ID
  AID-Agreement Id
  CT-Contact Type
  RT-Recipient Type
      1-to
      2-cc
      3-bcc
  CE-Contant Email
  CN-Company Name
  PN-Person Name
  D-Designation
  LN-Landline Number 
  MN-Mobile Number
  
  
  -+-Billing Details-+-
  
  BA-Borrow Address 
  BC-Borrow City 
  BS-Borrow State 
  BCC-Borrow Country Code
  BP-Borrow Pincode
  
  -+-Registered Address-+-
  
  RA-Register Address 
  RC-Register City 
  RS-Register State 
  RCC-Register Country Code 
  RP-Register Pincode
 



 */  

/* 
User Status
1 - Unverified
2 - Active
3 - Inactive
*/

/*  CT-Contact Type
	1 Borrower
	2 Promotor 
	3 Lender 
	4 Lender Agent 
	5 Legal Council (LLC) 
	6 Banks Legal Team (vetting) 
	7 Lender Insurance Agent (LIA) 
	8 Lenders Independent Engineer (LIE)
 */