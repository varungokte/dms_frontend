import { useEffect, useState, createElement } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import './styling.css';
import {socket} from "./socket";
import useGlobalContext from './../GlobalContext';
import { MastersMapping } from './../Constants';
import { FieldValues } from './../DataTypes';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "./components/ui/dropdown-menu";
import { Toaster } from './components/ui/toaster';

import { DashboardIcon, LoanIcon , ProductIcon, TransIcon, CompIcon , CovenantIcon, ConditionsIcon, MembersIcon, ManagementIcon, RoleIcon, MastersIcon, ZoneIcon, ScheduleIcon, /*  ReminderIcon, DefaultIcon, CriticalIcon, ReportsIcon */ } from "./../src/components/static/PanelIcons"
import beacon_logo from "./components/static/beacon_logo.png"
import ProfileIcon from './components/BasicComponents/ProfileIcon';
import PageNotFound from './components/BasicComponents/PageNotFound';

import Dashboard from './components/Dashboard';
import LoanAccount from './components/LoanAccount';
import CreateLoanAccount from './components/CreateLoanAccount';
import DealsList from './components/DealsList';
import UserManagement from './components/UserManagement';
import RoleManagement from './components/RoleManagement';
import FilterPage from './components/FilterPage';
import TeamManagement from './components/TeamManagement';
import Masters from './components/Masters';

export const MenuRouter = () => {
	const [hover,setHover] = useState(-1);
	const navigate = useNavigate();
	const {getDecryptedToken, getMastersList} = useGlobalContext();

	const [socketIsConnected, setSocketIsConnected] = useState( socket.connected);
  const [masterLists, setMasterLists] = useState<FieldValues>();
  const [mastersIdList, setMastersIdList] = useState<string[]>();
	const [changeInMasters,setChangeInMasters] = useState(true);
  
	useEffect(()=>{
    if (changeInMasters){
      getMastersList().then(res=>{
        if (res.status==200){
          const obj:any={};
          const idArr:string[]=[];
          res.obj.map((cat:any)=>{obj[cat.N]=cat.V; idArr.push(cat._id);});
          setMasterLists(obj);
          setMastersIdList(idArr);
          setChangeInMasters(false);
        }
        else
				setMasterLists({});
      }).catch(()=>{
        setMasterLists({})
      })
  }
  },[changeInMasters]);

	useEffect(()=>{
		if (!masterLists)
			return;
		for (let i=0; i<Object.keys(masterLists).length; i++){
			const cat = Object.keys(masterLists)[i];
			const vals = masterLists[cat];
			if ((Object.keys(MastersMapping).includes(cat))){
				while (MastersMapping[cat].length>1)
					MastersMapping[cat].pop()
				MastersMapping[cat].push(...vals);
			}
		}
	},[masterLists]);

	const onConnect = () => {
		try{
			setSocketIsConnected(()=>{const a = true; return a});
			socket.emit("sendMessage", {message:"Connection established"})
			//console.log("CONNECTED");
			socket.emit("subscribe", "BusinessChannel");
		}
		catch(err){}
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
		socket.on("messageReceived", ()=>{
			//console.log("RECIEVE",data)
		})
	},[])

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
			//console.log("token",res);
			if (res)
			setUserInfo(
				<DropdownMenu>
					<DropdownMenuTrigger className='mb-3 mx-6'>
						<div className="flex flex-row">
							<div><ProfileIcon name={res["N"]||"User"} size="small" showStatus={socketIsConnected}/></div>
							<div className="text-left mx-3">
								<p>{res["N"]}</p>
								<p className="font-light">{res["R"]||res["E"]||""}</p>
							</div>
						</div>
						</DropdownMenuTrigger>
					<DropdownMenuContent className='bg-white'>
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem ><button onClick={logoutUser}>Logout</button></DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		})
	},[socketIsConnected]);
	
	const [componentList] = useState([
		{ name: "Dashboard", path:"/", component: Dashboard, icon: DashboardIcon },
		{ name: "Role Management", path:"/roles", component: RoleManagement, icon:RoleIcon },
		{ name: "User Management", path:"/users", component: UserManagement, icon: ManagementIcon },
		{ name: "Team Management", path:"/teams", component: TeamManagement, icon: MembersIcon },
		{ name: "Loan Account", path:"/loan", component: LoanAccount, icon: LoanIcon },
		{ name: "Transaction Documents", path:"/transaction", component: DealsList, icon: TransIcon },
		{ name: "Compliance Documents", path:"/compliance", component: DealsList, icon: CompIcon },
		{ name: "Covenants", path:"/covenants", component: DealsList, icon: CovenantIcon },
		{ name: "Condition Precedent", path:"/precedent", component: DealsList, icon: ConditionsIcon },
		{ name: "Condition Subsequent", path:"/subsequent", component: DealsList, icon: ConditionsIcon },
		{ name: "Payment Schedule", path:"/schedule", component: DealsList, icon: ScheduleIcon},
		{ name: "Products", path:"/products", component: FilterPage, icon: ProductIcon },
		{ name: "Zones", path:"/zones", component: FilterPage, icon: ZoneIcon },
		{ name: "Masters", path:"/masters", component: Masters, icon:MastersIcon },

		//{ name: "Reminders", path:"/reminders", component: Reminders, icon: ReminderIcon },
		//{ name: "Default Cases", path:"/default", component: Default, icon: DefaultIcon },
		//{ name: "Critical Cases", path:"/critical", component: CriticalCases, icon: CriticalIcon },
		//{ name: "Reports", path:"/reports", component: Reports, icon: ReportsIcon },
	]);
	
	return (
		<div className='relative'>
			<Toaster/>
			<div style={{ width:"280px", float: "left", height: "100vh", position: "fixed", overflow:"auto" }} className="bg-custom-1" >
				<NavLink to={"/"} key={-1}	onMouseEnter={()=>setHover(-1)} onMouseLeave={()=>setHover(-1)}>
					<img src={beacon_logo} width={"250px"} className='m-auto p-3'/>
				</NavLink>
				<div className='mx-8 my-5'>
					{componentList.map((item:any,index:number)=>{
						return (
							<NavLink to={item.path} key={index}	onMouseEnter={()=>setHover(index)} onMouseLeave={()=>setHover(-1)}>
								{({ isActive }) => (
									<div className={`p-3 text-sm pageLink py-3 my-3 rounded-xl ${isActive?"bg-white text-custom-1":"text-white"}`}>
										<div className='flex flex-row'>
											{item.icon?createElement(item.icon, {fill: (isActive || hover===index)?"rgba(80, 65, 188, 1)":"white"}):""}
											<div className="mx-5">{item.name}</div>
										</div>
									</div>
								)}
							</NavLink>
						)
					})}
				</div>
			</div>
			
			<div style={{marginLeft:"280px",}}>
				<div className='relative h-20 w-100 bg-white'>
					<div className=' absolute inset-y-5 right-0 w-50'>
						{userInfo}
					</div>
				</div>
				<hr />
				<Routes>
					{componentList.map((item,index)=>{
						const componentProps:any = { key:index, label: item.name}
						if (item.component==Masters){
							componentProps["masterLists"] = masterLists;
							componentProps["idList"] = mastersIdList;
							componentProps["callMasterLists"] = setChangeInMasters
						}
						
						return <Route key={index} path={item.path} element={createElement(item.component, componentProps)} />
					})}
					<Route key={"C"} path="/loan/create/*" element={<CreateLoanAccount/>} />
					<Route key={"N"} path="/*" element={<PageNotFound/>} />
				</Routes>
			</div>
		</div>

	)
}
