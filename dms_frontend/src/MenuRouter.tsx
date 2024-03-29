import { Routes, Route, Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "./components/ui/dropdown-menu";

import TeamMembers from './components/TeamMembers';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Zones from './components/Zones';
import TeamTasks from './components/TeamTasks';
import DocumentList from './components/DocumentList';
import UserManagement from './components/UserManagement';
import Default from './components/Default';
import CreateLoanAccount from './components/CreateLoanAccount';
import CriticalCases from './components/CriticalCases';
import Reports from './components/Reports';
import Reminders from './components/Reminders';

import beacon_logo from "./components/static/beacon_logo.png";
import cla_icon from "./components/static/cla_icon.svg";
import DashboardIcon from './components/static/DashboardIcon';

export const MenuRouter = () => {
	const [currLink, setCurrLink] = useState("");

	const [txnTestData] = useState([
    ["ABC123", "Mortgage", "01/01/01", 
      [
        ["Lender's Agent Agreement", "PDF", 2, "02/02/02", 1, 12, ["lenderagreement.pdf" /* Will get the actual file(s) */]],
        ["Escrow Agent Agreement", "XLSX", 1, "03/03/02", 1, 1, ["escrow.pdf"]],
        ["Subordination Agreement", "PDF", 0, "03/03/02", 1, 1, ["subord.pdf"]],
        ["Agreement 1", "PDF", 2, "11/11/11", 1,3,["sponer.pdf"]],
        ["Agreement 2", "PDF", 1, "11/11/11", 2,3,["lender.pdf"]]
      ]
    ],

    ["DOC123", "Home Equity Loans", "02/05/07", 
      [
        ["Lender's Agent Agreement", "PDF", 2, "02/02/02", 1, 2, ["lenderagreement.pdf"]],
        ["Escrow Agent Agreement", "XLSX", 0, "03/03/02", 1, 1, ["escrow.pdf"]],
        ["Subordination Agreement", "PDF", 0, "03/03/02", 1, 1, ["subord.pdf"]],
      ]
    ]
  ])

	console.log(currLink)

	return (
		<div className='relative'>
			<div style={{ width: "17%", float: "left", height: "100vh", position: "fixed", overflowY:"scroll"}} className='bg-custom-1' >
				<div className=''>
					<img src={beacon_logo} width={"250px"} className='m-auto p-3'/>
					<div className='m-8' >
						<NavLink to="/" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("dash");
							return "";
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${(currLink==="dash")?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<DashboardIcon />
									<div className="mx-5">Dashboard</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="/loan" className={({ isActive, }) => {
								if (isActive)
								setCurrLink("loan");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="loan"?"bg-white text-custom-1":"text-white"}`}><div className='flex flex-row'><img src={cla_icon} className='mr-3'/><div>Create Loan Account</div></div></div>
						</NavLink>

						<NavLink to="/products" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("prod");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="prod"?"bg-white text-custom-1":"text-white"}`}>Products</div>
						</NavLink>

						<NavLink to="/transaction" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("transaction");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="transaction"?"bg-white text-custom-1":"text-white"}`}>Transaction Documents</div>
						</NavLink>

						<NavLink to="/compliance" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("compliance");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="compliance"?"bg-white text-custom-1":"text-white"}`}>Compliance Documents</div>
						</NavLink>

						<NavLink to="/covenants" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("covenants");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="covenants"?"bg-white text-custom-1":"text-white"}`}>Covenants</div>
						</NavLink>

						<NavLink to="/precedent" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("precedent");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="precedent"?"bg-white text-custom-1":"text-white"}`}>Conditions Precedent</div>
						</NavLink>

						<NavLink to="/subsequent" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("subsequent");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="subsequent"?"bg-white text-custom-1":"text-white"}`}>Conditions Subsequent</div>
						</NavLink>

						<NavLink to="/zones" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("zone");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="zone"?"bg-white text-custom-1":"text-white"}`}>Zone/City</div>
						</NavLink>

						<NavLink to="/team" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("team");
							return "";
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="team"?"bg-white text-custom-1":"text-white"}`}>Team Members</div>
						</NavLink>

						<NavLink to="/users" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("users");
							return "";
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="users"?"bg-white text-custom-1":"text-white"}`}>User Management</div>
						</NavLink>

						<NavLink to="/tasks" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("tasks");
							return "";
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="tasks"?"bg-white text-custom-1":"text-white"}`}>Team Tasks</div>
						</NavLink>

						<NavLink to="/reminders" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("reminders");
							return "";
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="reminders"?"bg-white text-custom-1":"text-white"}`}>Reminders</div>
						</NavLink>

						<NavLink to="/default" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("default");
							return "";
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="default"?"bg-white text-custom-1":"text-white"}`}>Default</div>
						</NavLink>

						<NavLink to="/critical" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("critical");
							return "";
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="critical"?"bg-white text-custom-1":"text-white"}`}>Critical Cases</div>
						</NavLink>

						<NavLink to="/reports" className={({ isActive, }) => {
							if (isActive)
								setCurrLink("reports");
							return "";
						}}>
							<div className={`p-3 text-md pageLink pr-10 py-3 rounded-xl ${currLink==="reports"?"bg-white text-custom-1":"text-white"}`}>Reports</div>
						</NavLink>
					</div>
				</div>
			</div>
			<div style={{ width: "83%", float: "right" }}>
				<div className='relative h-20 w-100 bg-white'>
					<div className=' absolute inset-y-5 right-0 w-50'>
						<DropdownMenu>
							<DropdownMenuTrigger className='mb-3 pt-3'>
								<span>You're logged in as: <span className='mt-2 text-blue-600'>Admin Person</span></span>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>Profile</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem><b>Logout</b></DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<hr />
				<Routes>
					<Route path="/" element={<Dashboard/>} />
					<Route path="/loan/*" element={<CreateLoanAccount/>} />
					<Route path="/products" element={<Products/>} />
					<Route path='/transaction' element={<DocumentList label={"Transaction Documents"} docData={txnTestData} />}/>
					<Route path='/compliance' element={<DocumentList label={"Compliance Documents"} docData={txnTestData} />}/>
					<Route path='/covenants' element={<DocumentList label={"Covenants"} docData={txnTestData} />}/>
					<Route path='/precedent' element={<DocumentList label={"Conditions Precedent"} docData={txnTestData} />}/>
					<Route path='/subsequent' element={<DocumentList label={"Conditions Subsequent"} docData={txnTestData} />}/>
					<Route path='/zones' element={<Zones/>} />					
					<Route path="/team" element={<TeamMembers/>} />
					<Route path="/users" element={<UserManagement/>} />
					<Route path="/tasks" element={<TeamTasks/>} />
					<Route path='/reminders' element={<Reminders/>} />
					<Route path='/default' element={<Default/>} />
					<Route path='/critical' element={<CriticalCases/>} />
					<Route path='/reports' element={<Reports/>} />
					<Route path="/*" element={<>Not Found</>} />
				</Routes>
			</div>
		</div>

	)
}
