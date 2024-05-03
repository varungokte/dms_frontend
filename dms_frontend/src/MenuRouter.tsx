import { Routes, Route, NavLink } from 'react-router-dom';
import { useEffect, useState, createElement } from 'react';
import { useNavigate } from "react-router-dom";
import {socket} from "./socket";
import useGlobalContext from './../GlobalContext';

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
import RoleManagement from './components/RoleManagement';

import beacon_logo from "./components/static/beacon_logo.png"
import ProfileIcon from './components/BasicComponents/ProfileIcon';
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
import TeamManagement from './components/TeamManagement';

export const MenuRouter = () => {
	const [currLink, setCurrLink] = useState("");
	const [hover,setHover] = useState(-1);
	const navigate = useNavigate();
	const {getDecryptedToken} = useGlobalContext();
	const [userInfo, setUserInfo] = useState(<div>Loading</div>);
	const [socketIsConnected, setSocketIsConnected] = useState(socket.connected);


	const onConnect = () => {
		try{
			setSocketIsConnected(()=>{const a = true; return a});
			socket.emit("sendMessage", {message:"Connection established"})
			console.log("CONNECTED")
			socket.emit("subscribe", "BusinessChannel");
		}
		catch(err){

		}
	}

	const onDisconnect = () => {
		setSocketIsConnected(false);
	}
	useEffect(()=>{
		socket.on("connect", onConnect);
		socket.on("connect_error",(error:any)=>{	
			console.log("socketerror")
		});
		socket.on("connect_failed", ()=>{
			console.log("socketfailed")
		} )
		socket.on("disconnect", onDisconnect);
		socket.on("messageReceived", (data:any)=>{
			console.log("RECIEVE",data)
		})
	},[])

	const logoutUser = () => {
		localStorage.removeItem("Beacon-DMS-token");
		navigate("/login");
	}
	
	const getUserInfo = async() => {
		const decodedToken = await getDecryptedToken();
		if (decodedToken)
			return decodedToken;
	}

	useEffect(()=>{
		getUserInfo().then(res=>{
			if (res)
			setUserInfo(
			<DropdownMenu>
				<DropdownMenuTrigger className='mb-3 mx-6'>
					<div className="flex flex-row">
						{/* @ts-ignore */}
						<div><ProfileIcon name="T U"/* {res["N"]} */ size="small" showStatus={socketIsConnected}/></div>
						<div className="text-left mx-3"> {/* @ts-ignore */}
							<p>{/* {res["N"]} */}Test User</p>
							<p className="font-light">No Role</p>
						</div>
					</div>
					</DropdownMenuTrigger>
				<DropdownMenuContent className='bg-white'>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem ><button onClick={logoutUser}>Logout</button></DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>);
		})
	},[socketIsConnected])
	
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
	const [componentList, setComponentList] = useState([
		{ name: "Dashboard", path:"", component: Dashboard, icon: DashboardIcon },
		{ name: "Loan Account", path:"loan", component: LoanAccount, icon: LoanIcon },
		{ name: "Products", path:"products", component: Products, icon: ProductIcon },
		{ name: "Transaction Documents", path:"transaction", component: DocumentList, icon: TransIcon },
		{ name: "Compliance Documents", path:"compliance", component: DocumentList, icon: CompIcon },
		{ name: "Covenants", path:"covenants", component: DocumentList, icon: CovenantIcon },
		{ name: "Conditions Precedent", path:"precedent", component: DocumentList, icon: ConditionsIcon },
		{ name: "Conditions Subsequent", path:"subsequent", component: DocumentList, icon: ConditionsIcon },
		{ name: "Zones", path:"zones", component: Zones, icon: ZoneIcon },
		{ name: "Role Management", path:"roles", component: RoleManagement },
		{ name: "Team Management", path:"teams", component: TeamManagement, icon: MembersIcon },
		{ name: "User Management", path:"users", component: UserManagement, icon: ManagementIcon },
		{ name: "Team Tasks", path:"tasks", component: TeamTasks, icon: TaskIcon },
		{ name: "Reminders", path:"reminders", component: Reminders, icon: ReminderIcon },
		{ name: "Default Cases", path:"default", component: Default, icon: DefaultIcon },
		{ name: "Critical Cases", path:"critical", component: CriticalCases, icon: CriticalIcon },
		{ name: "Reports", path:"reports", component: Reports, icon: ReportsIcon },
	])
	return (
		<div className='relative'>
			<div style={{ width: "17%", float: "left", height: "100vh", position: "fixed", overflowY:"scroll"}} className='bg-custom-1' >
				<div className=''>
					<img src={beacon_logo} width={"250px"} className='m-auto p-3'/>
					<div className='mx-8 my-5'>
						{componentList.map((item:any,index:number)=>{
							return (
								<NavLink to={item.path} key={index}
									onClick={()=>setCurrLink(item.path)}
									onMouseEnter={()=>setHover(index)} 
									onMouseLeave={()=>setHover(-1)}
									className={({ isActive, }) => {
										if (isActive)
											setCurrLink(item.path);
										return "bg-red-800";
									}}
								>
									<div className={`p-3 text-sm pageLink py-3 my-3 rounded-xl ${(currLink===item.path)?"bg-white text-custom-1":"text-white"}`}>
										<div className='flex flex-row'>
											{item.icon?createElement(item.icon, {fill: (currLink===item.path || hover===index)?"rgba(80, 65, 188, 1)":"white"}):""}
											<div className="mx-5">{item.name}</div>
										</div>
									</div>
								</NavLink>
							)
						})}
					</div>
				</div>
			</div>
			
			<div style={{ width: "83%", float: "right" }}>
				<div className='relative h-20 w-100 bg-white'>
					<div className=' absolute inset-y-5 right-0 w-50'>
						{userInfo}
					</div>
				</div>
				<hr />
				<Routes>
					{componentList.map((item,index)=>{
						if (item.component==DocumentList)
							return <Route key={index} path={item.path} element={createElement(item.component, { label: item.name, docData: txnTestData })}  />
						else
							return <Route key={index} path={item.path} element={createElement(item.component)} />
					})}
					<Route key={"C"} path="loan/create/*" element={<CreateLoanAccount/>} />
					<Route key={"T"} path="teams/:id" element={<TeamMembers/>} />
					<Route key={"N"} path="/*" element={<>Not Found</>} />
				</Routes>
			</div>
		</div>

	)
}
