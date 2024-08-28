import { useEffect, useState, createContext } from 'react';
import '@/styling.css';
import useGlobalContext from '@/functions/GlobalContext';
import { sectionNames } from '@/functions/Constants';
import { getDocSecList } from '@/functions/DocumentSectionAttributes';
import { FieldValues } from '@/types/DataTypes';
import { ComponentList } from '@/types/ComponentProps';

import { DashboardIcon, LoanIcon , ProductIcon, TransIcon, CompIcon , CovenantIcon, ConditionsIcon, MembersIcon, ManagementIcon, RoleIcon, MastersIcon, ZoneIcon, ScheduleIcon, DefaultIcon, CriticalIcon, /* ReportsIcon,  ReminderIcon */ } from "@/static/PanelIcons";

import {socket} from "@/functions/socket";
import socketConnector from '@/functions/socketConnector';
import getMasters from '@/functions/getMasters';
import SidePanel from '@/SiteComponents/SidePanel';
import TopPanel from '@/SiteComponents/TopPanel';
import Content from '@/SiteComponents/Content';

import Dashboard from '@/components/Dashboard';
import LoanAccount from '@/components/LoanAccount';
import DealsList from '@/components/DealsList';
import UserManagement from '@/components/UserManagement';
import RoleManagement from '@/components/RoleManagement';
import FilterPage from '@/components/FilterPage';
import TeamManagement from '@/components/TeamManagement';
import Masters from '@/components/Masters';
import SpecialCases from '@/components/SpecialCases';
//import Reminders from '@/components/Reminders';
//import Reports from '@/components/Reports';
import _TestComponent from '@/components/_TestComponent';
import UserAssignments from '@/components/UserAssignments';

//import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export const PermissionContext = createContext<any>(null);

function MenuRouter(){
	const allComponents:ComponentList = [
		{ name: "Dashboard", path:"/", component: Dashboard, icon: DashboardIcon },//0
		{ name: "Masters", path:"/masters", component: Masters, icon:MastersIcon },//1
		{ name: "Role Management", path:"/roles", component: RoleManagement, icon:RoleIcon },//2
		{ name: "User Management", path:"/users", component: UserManagement, icon: ManagementIcon },//3
		{ name: "Team Management", path:"/teams", component: TeamManagement, icon: MembersIcon },//4
		{ name: "Loan Account", path:"/loan", component: LoanAccount, icon: LoanIcon },//5
		{ name: "Transaction Documents", path:"/transaction", component: DealsList, icon: TransIcon },//6
		{ name: "Compliance Documents", path:"/compliance", component: DealsList, icon: CompIcon },//7
		{ name: "Covenants", path:"/covenants", component: DealsList, icon: CovenantIcon },//8
		{ name: "Condition Precedent", path:"/precedent", component: DealsList, icon: ConditionsIcon },//9
		{ name: "Condition Subsequent", path:"/subsequent", component: DealsList, icon: ConditionsIcon },//10
		{ name: "Payment Schedule", path:"/schedule", component: DealsList, icon: ScheduleIcon},//11
		{ name: "Products", path:"/products", component: FilterPage, icon: ProductIcon },//12
		{ name: "Zones", path:"/zones", component: FilterPage, icon: ZoneIcon },//13
		/* { name: "Reminders", path:"/reminders", component: Reminders, icon: ReminderIcon },//14 */
		{ name: "Default Cases", path:"/default", component: SpecialCases, icon: DefaultIcon },//15
		{ name: "Critical Cases", path:"/critical", component: SpecialCases, icon: CriticalIcon },//16
		/* { name: "Reports", path:"/reports", component: Reports, icon: ReportsIcon },//17 */
	
		{ name: "Master Transaction Documents", path:"/admin/transaction", component: DealsList, icon: TransIcon, panopticPage:true },//18
		{ name: "Master Compliance Documents", path:"/admin/compliance", component: DealsList, icon: CompIcon, panopticPage:true },//19
		{ name: "Master Covenants", path:"/admin/covenants", component: DealsList, icon: CovenantIcon, panopticPage:true },//20
		{ name: "Master Condition Precedent", path:"/admin/precedent", component: DealsList, icon: ConditionsIcon, panopticPage:true },//21
		{ name: "Master Condition Subsequent", path:"/admin/subsequent", component: DealsList, icon: ConditionsIcon, panopticPage:true },//22
		{ name: "Master Payment Schedule", path:"/admin/schedule", component: DealsList, icon: ScheduleIcon, panopticPage:true },//23
		{ name: "Master Default Cases", path:"/admin/default", component:SpecialCases, icon:DefaultIcon, panopticPage:true },//24
		{ name: "Master Critical Cases", path:"/admin/critical", component:SpecialCases, icon:CriticalIcon, panopticPage:true },//25

		{ name: "User Assignments", path:"/assign", component:UserAssignments},//26
	
		{ name: "Test", path:"/test", component: _TestComponent },//27
	];

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

	const [componentList, setComponentList] = useState<ComponentList>();

	useEffect(()=>{
		if (!userPermissions){
			const arr = [];
			arr.push(allComponents[0]);
			arr.push(allComponents[1]);
			//arr.push(allComponents[27]);
			setComponentList(arr);
			return;
		}
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
		arr.push(allComponents[16]);
		arr.push(allComponents[17]);
		arr.push(allComponents[18]);
		arr.push(allComponents[19]);
		arr.push(allComponents[20]);
		arr.push(allComponents[21]);
		arr.push(allComponents[22]);
		arr.push(allComponents[23]);
		arr.push(allComponents[24]);
		//arr.push(allComponents[26]);
		//arr.push(allComponents[27]);
		setComponentList(arr);
	},[userPermissions]);

	//useEffect(()=>console.log("USER PERMISSIONS",userPermissions),[userPermissions]);

	//useEffect(()=>console.log("menu router",socketIsConnected),[socketIsConnected])
	
	return (
		<PermissionContext.Provider value={{userPermissions, setUserPermissions}}>
			<div className='relative'>
				<div style={{ width:"280px", float: "left", height: "100vh", position: "fixed", overflow:"auto" }} className="bg-custom-1">
					<SidePanel componentList={componentList} token={token} />
				</div>
				
				<div style={{marginLeft:"280px"}}>
					<TopPanel token={token} socketIsConnected={socketIsConnected} />
					<hr />
					<Content componentList={componentList} masterLists={masterLists} mastersIdList={mastersIdList} setChangeInMasters={setChangeInMasters} />
				</div>
			</div>
		</PermissionContext.Provider>
	)
}

export default MenuRouter;