import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useEffect, useState, createElement } from 'react';
import { useNavigate } from "react-router-dom";
//import {socket} from "./socket";
import useGlobalContext from './../GlobalContext';
import './styling.css';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "./components/ui/dropdown-menu";

import Dashboard from './components/Dashboard';
import LoanAccount from './components/LoanAccount';
import CreateLoanAccount from './components/CreateLoanAccount';
import Products from './components/Products';
//import TeamMembers from './components/UnusedComponents/TeamMembers';
import DocumentList from './components/DocumentList';
import UserManagement from './components/UserManagement';
import RoleManagement from './components/RoleManagement';
import TeamManagement from './components/TeamManagement';
//import Zones from './components/Zones';
//import Default from './components/DefaultCases';
//import CriticalCases from './components/CriticalCases';
//import Reports from './components/Reports';
//import Reminders from './components/Reminders';
import { Toaster } from './components/ui/toaster';

import beacon_logo from "./components/static/beacon_logo.png"
import ProfileIcon from './components/BasicComponents/ProfileIcon';

import {DashboardIcon, LoanIcon , ProductIcon, TransIcon, CompIcon , CovenantIcon, ConditionsIcon, MembersIcon, ManagementIcon, RoleIcon, /* ZoneIcon, ReminderIcon, DefaultIcon, CriticalIcon, ReportsIcon */} from "./../src/components/static/PanelIcons"

/* import Masters from './components/Masters';
import DocumentViewer from './components/BasicComponents/DocumentViewer'; */


export const MenuRouter = () => {
	const [currLink, setCurrLink] = useState("");
	const [hover,setHover] = useState(-1);
	const navigate = useNavigate();
	const {getDecryptedToken} = useGlobalContext();

/* 
	const [socketIsConnected, setSocketIsConnected] = useState( socket.connected);

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
		socket.on("connect_error",()=>{	
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
 */
	const logoutUser = () => {
		localStorage.removeItem("Beacon-DMS-token");
		navigate("/login");
	}
	
	const [userInfo, setUserInfo] = useState(<p>Loading</p>);
	
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
						<div><ProfileIcon name={res["N"]} size="small" showStatus={true/* socketIsConnected */}/></div>
						<div className="text-left mx-3">
							<p>{res["N"]}</p>
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
	},[/* socketIsConnected */]);
	
	const [componentList] = useState([
		{ name: "Dashboard", path:"/", component: Dashboard, icon: DashboardIcon },
		{ name: "User Management", path:"/users", component: UserManagement, icon: ManagementIcon },
		{ name: "Team Management", path:"/teams", component: TeamManagement, icon: MembersIcon },
		{ name: "Loan Account", path:"/loan", component: LoanAccount, icon: LoanIcon },
		{ name: "Transaction Documents", path:"/transaction", component: DocumentList, icon: TransIcon },
		{ name: "Compliance Documents", path:"/compliance", component: DocumentList, icon: CompIcon },
		{ name: "Covenants", path:"/covenants", component: DocumentList, icon: CovenantIcon },
		{ name: "Condition Precedent", path:"/precedent", component: DocumentList, icon: ConditionsIcon },
		{ name: "Condition Subsequent", path:"/subsequent", component: DocumentList, icon: ConditionsIcon },
		{ name: "Products", path:"/products", component: Products, icon: ProductIcon },
		{ name: "Role Management", path:"/roles", component: RoleManagement, icon:RoleIcon },
		//{ name: "Zones", path:"/zones", component: Zones, icon: ZoneIcon },
		//{ name: "Reminders", path:"/reminders", component: Reminders, icon: ReminderIcon },
		//{ name: "Default Cases", path:"/default", component: Default, icon: DefaultIcon },
		//{ name: "Critical Cases", path:"/critical", component: CriticalCases, icon: CriticalIcon },
		//{ name: "Reports", path:"/reports", component: Reports, icon: ReportsIcon },
		//{ name: "Masters", path:"/masters", component: Masters, },
	]);
	
	return (
		<div className='relative'>
			<Toaster/>
			<div style={{ width:"280px", float: "left", height: "100vh", position: "fixed", overflow:"auto" }} className="bg-custom-1" >
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
			
			<div style={ {marginLeft:"280px",} }>
				<div className='relative h-20 w-100 bg-white'>
					<div className=' absolute inset-y-5 right-0 w-50'>
						{userInfo}
					</div>
				</div>
				<hr />
				<Routes>
					{componentList.map((item,index)=>{
						return <Route key={index} path={item.path} element={createElement(item.component, { key:index, label: item.name })} />
					})}
					<Route key={"V"} path='/verify' element={<Navigate to="/"/>}/>
					<Route key={"C"} path="/loan/create/*" element={<CreateLoanAccount/>} />
					{/* <Route key={"T"} path="/teams/:id" element={<TeamMembers/>} /> */}
					<Route key={"N"} path="/*" element={<>Not Found</>} />
				</Routes>
			</div>
		</div>

	)
}
