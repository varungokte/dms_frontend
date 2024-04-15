import { Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "./components/ui/dropdown-menu";

import Dashboard from './components/Dashboard';
import CreateLoanAccount from './components/CreateLoanAccount';
import Products from './components/Products';
import TeamMembers from './components/TeamMembers';
import Zones from './components/Zones';
import TeamTasks from './components/TeamTasks';
import DocumentList from './components/DocumentList';
import UserManagement from './components/UserManagement';
import Default from './components/Default';
import CriticalCases from './components/CriticalCases';
import Reports from './components/Reports';
import Reminders from './components/Reminders';

import beacon_logo from "./components/static/beacon_logo.png"
import DashboardIcon from './components/static/PanelIcons/DashboardIcon';
import LoanIcon from './components/static/PanelIcons/LoanIcon';
import ProductIcon from './components/static/PanelIcons/ProductIcon';
import TransIcon from './components/static/PanelIcons/TransIcon';
import CompIcon from './components/static/PanelIcons/CompIcon';
import CovenantIcon from './components/static/PanelIcons/CovenantIcon';
import ConditionsIcon from './components/static/PanelIcons/ConditionsIcon';
import ZoneIcon from './components/static/PanelIcons/ZoneIcon';
import MembersIcon from './components/static/PanelIcons/MembersIcon';
import ManagementIcon from './components/static/PanelIcons/ManagementIcon';
import TaskIcon from './components/static/PanelIcons/TaskIcon';
import ReminderIcon from './components/static/PanelIcons/ReminderIcon';
import DefaultIcon from './components/static/PanelIcons/DefaultIcon';
import LoanAccount from './components/LoanAccount';
import CriticalIcon from './components/static/PanelIcons/CriticalIcon';
import ReportsIcon from './components/static/PanelIcons/ReportsIcon';

export const MenuRouter = () => {
	const [currLink, setCurrLink] = useState("");
	const [hover,setHover] = useState(-1);
	const navigate = useNavigate();

	const logoutUser = () => {
		localStorage.removeItem("Beacon-DMS-token");
		navigate("/login");
	}
	
	const [txnTestData] = useState([
    ["ABC123", "Mortgage", "01/01/01", 
      [
        ["Lender's Agent Agreement", "PDF", 2, "02/02/02", 1, 12, ["lenderagreement.pdf" /* Will get the actual file(s) */]],
        ["Escrow Agent Agreement", "XLSX", 1, "03/03/02", 0, 0, []],
        ["Subordination Agreement", "PDF", 0, "03/03/02", 1, 1, ["subord.pdf"]],
        ["Agreement 1", "PDF", 2, "11/11/11", 1,3,[]],
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
  ]);
	
	return (
		<div className='relative'>
			<div style={{ width: "17%", float: "left", height: "100vh", position: "fixed", overflowY:"scroll"}} className='bg-custom-1' >
				<div className=''>
					<img src={beacon_logo} width={"250px"} className='m-auto p-3'/>
					<div className='mx-8 my-5' >
						<NavLink to=""
							onMouseEnter={()=>setHover(0)} 
							onMouseLeave={()=>setHover(-1)} 
							 className={({ isActive, }) => {
							if (isActive)
								setCurrLink("");
							return "";
							}}>
							<div 
							className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${(currLink==="")?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<DashboardIcon fill={(currLink==="" || hover===0)?"rgba(80, 65, 188, 1)":"white"}/>
									<div className="mx-5">Dashboard</div>
								</div>
							</div>
						</NavLink>
						<NavLink to="loan" 
							onMouseEnter={()=>setHover(1)} 
							onMouseLeave={()=>setHover(-1)}
							 className={({ isActive, }) => {
								if (isActive)
								setCurrLink("loan");
							return ""; 
						}}>
							<div 
							className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="loan"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<LoanIcon fill={(currLink==="loan" || hover===1)?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Loan Account</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="products" 
						onMouseEnter={()=>setHover(2)} 
						onMouseLeave={()=>setHover(-1)}
						className={({ isActive, }) => {
							if (isActive)
								setCurrLink("products");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="products"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<ProductIcon fill={currLink==="products" || hover===2?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Products</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="transaction" 
							onMouseEnter={()=>setHover(3)} 
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("transaction");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="transaction"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<TransIcon fill={currLink==="transaction"||hover===3?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Transaction Documents</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="compliance" 
							onMouseEnter={()=>setHover(4)} 
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("compliance");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="compliance"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<CompIcon fill={currLink==="compliance" || hover===4?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Compliance Documents</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="covenants" 
							onMouseEnter={()=>setHover(5)}
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("covenants");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="covenants"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<CovenantIcon fill={currLink==="covenants" || hover===5?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Covenants</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="precedent" 
							onMouseEnter={()=>setHover(6)}
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("precedent");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="precedent"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<ConditionsIcon fill={currLink==="precedent" || hover===6?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Condtions Precedent</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="subsequent" 
							onMouseEnter={()=>setHover(7)}
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("subsequent");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="subsequent"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<ConditionsIcon fill={currLink==="subsequent" || hover===7?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Condtions Subsequent</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="zones" 
							onMouseEnter={()=>setHover(8)}
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("zone");
							return ""; 
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="zone"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<ZoneIcon fill={currLink==="zone" || hover===8?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Zone/City</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="team" 
							onMouseEnter={()=>setHover(9)}
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("team");
							return "";
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="team"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<MembersIcon fill={currLink==="team" || hover===9?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Team Members</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="users" 
							onMouseEnter={()=>setHover(10)}
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("users");
							return "";
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="users"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<ManagementIcon fill={currLink==="users" || hover===10?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>User Management</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="tasks" 
							onMouseEnter={()=>setHover(11)}
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("tasks");
							return "";
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="tasks"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<TaskIcon fill={currLink==="tasks" || hover===11?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Team Tasks</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="reminders" 
							onMouseEnter={()=>setHover(12)}
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("reminders");
							return "";
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="reminders"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<ReminderIcon fill={currLink==="reminders" || hover===12?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Reminders</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="default" 
							onMouseEnter={()=>setHover(13)}
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("default");
							return "";
						}}>
							<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="default"?"bg-white text-custom-1":"text-white"}`}>
								<div className='flex flex-row'>
									<DefaultIcon fill={currLink==="default"|| hover===13?"rgba(80, 65, 188, 1)":"white"}/>
									<div className='mx-3'>Default Cases</div>
								</div>
							</div>
						</NavLink>

						<NavLink to="critical" 
							onMouseEnter={()=>setHover(14)}
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("critical");
							return "";
						}}>
						<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="critical"?"bg-white text-custom-1":"text-white"}`}>
							<div className='flex flex-row'>
								<CriticalIcon fill={currLink==="critical"|| hover===14?"rgba(80, 65, 188, 1)":"white"}/>
								<div className='mx-3'>Critical Cases</div>
							</div>
						</div>
						</NavLink>

						<NavLink to="reports" 
							onMouseEnter={()=>setHover(15)}
							onMouseLeave={()=>setHover(-1)}
							className={({ isActive, }) => {
							if (isActive)
								setCurrLink("reports");
							return "";
						}}>
						<div className={`p-3 text-md pageLink py-3 my-3 rounded-xl ${currLink==="reports"?"bg-white text-custom-1":"text-white"}`}>
							<div className='flex flex-row'>
								<ReportsIcon fill={currLink==="reports"|| hover===15?"rgba(80, 65, 188, 1)":"white"}/>
							</div>
								<div className='mx-3'>Reports</div>
						</div>
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
							<DropdownMenuContent className='bg-white'>
								<DropdownMenuItem>Profile</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem ><button onClick={logoutUser}>Logout</button></DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<hr />
				<Routes>
					<Route path="" element={<Dashboard/>} />
					<Route path="loan/*" element={<LoanAccount/>} />
					<Route path="loan/create/*" element={<CreateLoanAccount/>} />
					<Route path="products" element={<Products/>} />
					<Route path='transaction' element={<DocumentList label={"Transaction Documents"} docData={txnTestData} />}/>
					<Route path='compliance' element={<DocumentList label={"Compliance Documents"} docData={txnTestData} />}/>
					<Route path='covenants' element={<DocumentList label={"Covenants"} docData={txnTestData} />}/>
					<Route path='precedent' element={<DocumentList label={"Conditions Precedent"} docData={txnTestData} />}/>
					<Route path='subsequent' element={<DocumentList label={"Conditions Subsequent"} docData={txnTestData} />}/>
					<Route path='zones' element={<Zones/>} />					
					<Route path="team" element={<TeamMembers/>} />
					<Route path="users" element={<UserManagement/>} />
					<Route path="tasks" element={<TeamTasks/>} />
					<Route path='reminders' element={<Reminders/>} />
					<Route path='default' element={<Default/>} />
					<Route path='critical' element={<CriticalCases/>} />
					<Route path='reports' element={<Reports/>} />
					<Route path="/*" element={<>Not Found</>} />
				</Routes>
			</div>
		</div>

	)
}
