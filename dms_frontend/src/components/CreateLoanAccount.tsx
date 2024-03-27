import { useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";

import ContactDetails from "./LoanAccountComponents/Contact Details";
import Ratings from "./LoanAccountComponents/Ratings";
import LoanDocuments from "./LoanAccountComponents/LoanDocuments";
import Covenants from "./LoanAccountComponents/Covenants";

function CreateLoanAccount() {
	const [currLink, setCurrLink] = useState("");
  
  return(
    <div>
			<p className="text-3xl font-bold m-7">Create Loan Account</p>

      <div className="flex flex-row flex-wrap mx-10 mr-2">
        <NavLink to="contact" className={({ isActive, }) => {
          if (isActive)
            setCurrLink("contact");
          return "m-3 w-56 ";
        }}>
          <div className={`p-5 rounded-xl border-2 ${(currLink==="contact")?"bg-violet-800 text-white":"bg-white text-black"}`}>Contact Details</div>
        </NavLink>

        <NavLink to="mapping" className={({ isActive, }) => {
          if (isActive)
            setCurrLink("mapping");
          return "m-3 w-56";
        }}>
          <div className={`p-5 rounded-xl border-2 ${(currLink==="mapping")?"bg-violet-800 text-white":"bg-white text-black"}`}>Relationship Mapping</div>
        </NavLink>

        <NavLink to="transaction" className={({ isActive, }) => {
          if (isActive)
            setCurrLink("transaction");
          return "m-3 w-56";
        }}>
          <div className={`p-5 rounded-xl border-2 ${(currLink==="transaction")?"bg-violet-800 text-white":"bg-white text-black"}`}>Transaction Documents</div>
        </NavLink>

        <NavLink to="compliance" className={({ isActive, }) => {
          if (isActive)
            setCurrLink("compliance");
          return "m-3 w-56";
        }}>
          <div className={`p-5 rounded-xl border-2 ${(currLink==="compliance")?"bg-violet-800 text-white":"bg-white text-black"}`}>Compliance Documents</div>
        </NavLink>

        <NavLink to="covenants" className={({ isActive, }) => {
          if (isActive)
            setCurrLink("covenants");
          return "m-3 w-56";
        }}>
          <div className={`p-5 rounded-xl border-2 ${(currLink==="covenants")?"bg-violet-800 text-white":"bg-white text-black"}`}>Covenants</div>
        </NavLink>

        <NavLink to="precedent" className={({ isActive, }) => {
          if (isActive)
            setCurrLink("precedent");
          return "m-3 w-56";
        }}>
          <div className={`p-5 rounded-xl border-2 ${(currLink==="precedent")?"bg-violet-800 text-white":"bg-white text-black"}`}>Conditions Precedent</div>
        </NavLink>

        <NavLink to="subsequent" className={({ isActive, }) => {
          if (isActive)
            setCurrLink("subsequent");
          return "m-3 w-56";
        }}>
          <div className={`p-5 rounded-xl border-2 ${(currLink==="subsequent")?"bg-violet-800 text-white":"bg-white text-black"}`}>Conditions Subsequent</div>
        </NavLink>

        <NavLink to="ratings" className={({ isActive, }) => {
          if (isActive)
            setCurrLink("ratings");
          return "m-3 w-56";
        }}>
          <div className={`p-5 rounded-xl border-2 ${(currLink==="ratings")?"bg-violet-800 text-white":"bg-white text-black"}`}>Ratings</div>
        </NavLink>

        <NavLink to="schedule" className={({ isActive, }) => {
          if (isActive)
            setCurrLink("schedule");
          return "m-3 w-56";
        }}>
          <div className={`p-5 rounded-xl border-2 ${(currLink==="schedule")?"bg-violet-800 text-white":"bg-white text-black"}`}>Payment Schedule</div>
        </NavLink>

      </div>

    <div className="m-10">
      <Routes>
        <Route path="contact" element={<ContactDetails/>}/>
        <Route path="mapping" element={<p>Relationsipo MApoepong</p>}/>
        <Route path="transaction" element={<LoanDocuments label={"Transaction Documents"}/>}/>
        <Route path="compliance" element={<LoanDocuments label={"Compliance Documents"}/>}/>
        <Route path="covenants" element={<Covenants/>}/>
        <Route path="precedent" element={<p>Codnsiinsa precendent</p>}/>
        <Route path="subsequent" element={<p>Constidipsn seuncescyew</p>}/>
        <Route path="ratings" element={<Ratings/>}/>
        <Route path="schedule" element={<p>PAtnemnt Schedisel</p>}/>
      </Routes>
    </div>
    </div>
  )
}

export default CreateLoanAccount;