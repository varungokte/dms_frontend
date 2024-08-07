import { useEffect, useState, FunctionComponent, createContext } from 'react';
import './styling.css';
import useGlobalContext from './../GlobalContext';
import { allComponents, getDocSecList, sectionNames } from './../Constants';
import { FieldValues } from './../DataTypes';
import {socket} from "./socket";

import { ThemeProvider, } from '@mui/material/styles';
import socketConnector from './socketConnector';
import getMasters from './getMasters';
import { customColor } from './MUIPalette';
import SidePanel from './SidePanel';
import TopPanel from './TopPanel';
import Content from './Content';
//import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';


export const PermissionContext = createContext<any>(null);

function MenuRouter(){

	const {getDecryptedToken, getSingleUser} = useGlobalContext();

	const [socketIsConnected, setSocketIsConnected] = useState(false);
	
  const [masterLists, setMasterLists] = useState<FieldValues>();
  const [mastersIdList, setMastersIdList] = useState<string[]>();
	const [changeInMasters,setChangeInMasters] = useState(true);
	const [token, setToken] = useState<FieldValues>();
	
	const [userPermissions, setUserPermissions] = useState<FieldValues>();
	
	const getUserInfo = async() => {
		const decodedToken = await getDecryptedToken();
		if (decodedToken){
			setToken(decodedToken)
			return decodedToken;
		}
	}

	useEffect(()=>{
		if (socket.connected)
			setSocketIsConnected(true);
		else if (socket.disconnected)
			setSocketIsConnected(false);
	},[socket])

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
		socketConnector(setSocketIsConnected);
	},[]);

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
		arr.push(allComponents[19]);
		arr.push(allComponents[20]);
		arr.push(allComponents[21]);
		arr.push(allComponents[22]);
		arr.push(allComponents[23]);
		arr.push(allComponents[24]);
		arr.push(allComponents[25]);
		arr.push(allComponents[26]);
		setComponentList(arr);
	},[userPermissions]);

	//useEffect(()=>console.log("USER PERMISSIONS",userPermissions),[userPermissions]);

	//useEffect(()=>console.log("menu router",socketIsConnected),[socketIsConnected])
	
	return (
		<ThemeProvider theme={customColor}>
			<PermissionContext.Provider value={{userPermissions, setUserPermissions}}>
				<div className='relative'>
					<div  style={{ width:"280px", float: "left", height: "100vh", position: "fixed", overflow:"auto" }} className="bg-custom-1">
						<SidePanel componentList={componentList} token={token} />
						
					</div>
					
					<div style={{marginLeft:"280px"}}>
						<TopPanel token={token} socketIsConnected={socketIsConnected} />
						<hr />
						<Content componentList={componentList} masterLists={masterLists} mastersIdList={mastersIdList} setChangeInMasters={setChangeInMasters} />
						
					</div>
				</div>
			</PermissionContext.Provider>
		</ThemeProvider>
	)
}

export default MenuRouter;