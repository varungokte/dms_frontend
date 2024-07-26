import { useEffect, useState, createElement, FunctionComponent, createContext } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import './styling.css';
import useGlobalContext from './../GlobalContext';
import { MastersMapping, allComponents, getDocSecList, sectionNames } from './../Constants';
import { FieldValues } from './../DataTypes';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "./components/ui/dropdown-menu";

import beacon_logo from "./components/static/beacon_logo.png"
import ProfileIcon from './components/BasicComponents/ProfileIcon';
import PageNotFound from './components/PageNotFound';
//import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import CreateLoanAccount from './components/CreateLoanAccount';
import socketConnector from './socketConnector';
import getMasters from './getMasters';

export const PermissionContext = createContext<any>(null);

export const MenuRouter = () => {
	const [hover,setHover] = useState(-1);
	const navigate = useNavigate();
	const {getDecryptedToken, getSingleUser,editUser} = useGlobalContext();

	const [socketIsConnected, setSocketIsConnected] = useState(false);
  const [masterLists, setMasterLists] = useState<FieldValues>();
  const [mastersIdList, setMastersIdList] = useState<string[]>();
	const [changeInMasters,setChangeInMasters] = useState(true);
	const [token, setToken] = useState<FieldValues>();
	
	const [userPermissions, setUserPermissions] = useState<FieldValues>();
	
	const getUserInfo = async() => {
		const decodedToken = await getDecryptedToken();
		if (decodedToken)
			return decodedToken;
	}
	
	const logoutUser = () => {
		localStorage.removeItem("Beacon-DMS-token");
		navigate("/login");
	}

	//useEffect(()=>console.log("in menu router, user permissions", userPermissions),[userPermissions]);

	const fixPermissions = async () => {
		const defaultPermissions:FieldValues={};
		Object.values(sectionNames).map(section=>defaultPermissions[section]=["access", "add", "edit","view","delete"]);
		defaultPermissions["team"].push("select")
		defaultPermissions["transaction"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["compliance"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["covenants"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["precedent"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["subsequent"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}

		defaultPermissions["payment"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}

    const token = await getUserInfo();
    const obj = {_id:token["_userId"], UP: defaultPermissions}
		//console.log("UP",defaultPermissions)
    const res = await editUser(obj);
    console.log(res);
  }

	useEffect(()=>{
		//get user permissions
		getUserInfo().then(res=>{
			const id = res["_userId"];
			getSingleUser(id).then(res=>{
				//console.log("A",res)
				if (res.status==200)
					setUserPermissions(res.obj["UP"])
			})
		})
	},[]);

  
	useEffect(()=>{
		//get new masters
    if (changeInMasters){
      getMasters(setMasterLists, setMastersIdList).then(()=>{
				setChangeInMasters(false);
			})
  }
  },[changeInMasters]);

	useEffect(()=>{
		//set the values of masters
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

	useEffect(()=>{
		socketConnector(setSocketIsConnected);
	},[]);
	
	useEffect(()=>{
		getUserInfo().then(res=>{
			//console.log("token",res);
			if (res)
				setToken(res);
		})
	},[socketIsConnected]);

	const [componentList, setComponentList] = useState<{name:string,path:string, component:FunctionComponent<any>, icon?:Function}[]>();

	useEffect(()=>{
		if (!userPermissions)
			return;
		const arr = [];
		arr.push(allComponents[0]);
		
		for (let i=0; i<allComponents.length; i++){
			const singleComponent = allComponents[i];
			const componentPermissions = userPermissions[sectionNames[singleComponent.name]];
			if ((singleComponent.name=="Products" || singleComponent.name=="Zones") && userPermissions["loan"].includes("access"))
				arr.push(singleComponent);
			
			if (componentPermissions==undefined || componentPermissions.length==0)
				continue;
			
			if (getDocSecList("fullname").includes(singleComponent.name)){
				if (componentPermissions["docs"].includes("access") || componentPermissions["file"].includes("access"))
					arr.push(singleComponent);
			}
			else if (componentPermissions.includes("access"))
				arr.push(singleComponent);
		}
		arr.push(allComponents[18]);
		setComponentList(arr);
	},[userPermissions])

	//useEffect(()=>console.log("USER PERMISSIONS",userPermissions),[userPermissions]);
	
	return (
		<PermissionContext.Provider value={{userPermissions, setUserPermissions}}>
		<div className='relative'>
			<div style={{ width:"280px", float: "left", height: "100vh", position: "fixed", overflow:"auto" }} className="bg-custom-1" >
				<NavLink to={"/"} key={-1}	onMouseEnter={()=>setHover(-1)} onMouseLeave={()=>setHover(-1)}>
					<img src={beacon_logo} width={"250px"} className='m-auto p-3'/>
				</NavLink>
				<div className='mx-8 my-5'>

				<button onClick={fixPermissions}>Fix Permissions</button>
					{componentList
						?componentList.map((item:any,index:number)=>{
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
						})
						:<></>}
				</div>
			</div>
			
			<div style={{marginLeft:"280px",}}>
				<div className='relative h-20 w-100 bg-white'>
					<div className=' absolute inset-y-5 right-0 w-50'>
						{token
							?<div>
								{/* <NotificationsNoneIcon fontSize="large" sx={{color:"rgba(80, 65, 188, 1)"}}/> */}
								<DropdownMenu>
									<DropdownMenuTrigger className='mb-3 mx-6'>
										<div className="flex flex-row">
											<div><ProfileIcon name={token["N"]||"User"} size="small" showStatus={socketIsConnected}/></div>
											<div className="text-left mx-3">
												<p>{token["N"]}</p>
												<p className="font-light">{token["R"]||token["E"]||""}</p>
											</div>
										</div>
										</DropdownMenuTrigger>
									<DropdownMenuContent className='bg-white'>
										<DropdownMenuItem>Profile</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem ><button onClick={logoutUser}>Logout</button></DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							:<p>Loading</p>
						}
					</div>
				</div>
				<hr />
				<Routes>
					{componentList
						?componentList.map((item,index)=>{
							const componentProps:any = { key:index, label: item.name}
							if (item.name=="Masters"){
								componentProps["masterLists"] = masterLists;
								componentProps["idList"] = mastersIdList;
								componentProps["callMasterLists"] = setChangeInMasters
							}
							
							return <Route key={index} path={item.path} element={createElement(item.component, componentProps)} />
						})
						:<></>
					}
					<Route key={"C"} path="/loan/create/*" element={<CreateLoanAccount/>} />
					<Route key={"N"} path="/*" element={<PageNotFound/>} />
				</Routes>
			</div>
		</div>
		</PermissionContext.Provider>
	)
}