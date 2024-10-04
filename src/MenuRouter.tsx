import { useContext, useEffect, useState } from 'react';
import '@/styling.css';
import { MasterValuesContext, PermissionContext, SocketContext } from '@/Contexts';
import { allComponents, mastersKeyToLabels } from './Constants';

import { getDocSecList, getModSecName } from '@/functions/sectionNameAttributes';
import { FieldValues, MastersValues } from '@/types/DataTypes';
import { ComponentList } from '@/types/ComponentProps';
import { getDecryptedToken } from '@/functions/getToken';
import { getSingleUser } from './apiFunctions/userAPIs';
import { getMastersList } from '@/apiFunctions/masterAPIs';	

import {socketConnector,/* checkSocketIsConnected */} from '@/functions/socketConnector';
import SidePanel from '@/components/SiteComponents/SidePanel';
import TopPanel from '@/components/SiteComponents/TopPanel';
import Content from '@/components/SiteComponents/Content';
import _TestComponent from '@/components/_TestComponent';

//import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

function MenuRouter(){
	const socket = useContext(SocketContext);
  
	const [mastersValues, setMastersValues] = useState<FieldValues>();
	const [mastersId, setMastersId] = useState<string>();
	const [changeInMasters,setChangeInMasters] = useState(true);
	
	const [socketIsConnected, setSocketIsConnected] = useState(false);
	const [token, setToken] = useState<FieldValues>();	
	const [componentList, setComponentList] = useState<ComponentList>();
	const [userPermissions, setUserPermissions] = useState<FieldValues>();
	
	const getUserInfo = async() => {
		const decodedToken = await getDecryptedToken();
		if (decodedToken){
			setToken(decodedToken)
			return decodedToken;
		}
	}
	
	const getMasters = async () => {
		const res = await getMastersList();
		if (res.status==200){
			const obj:any={};
			const mastersFromServer = res.obj;

			setMastersId(mastersFromServer["_id"]);
			
			Object.keys(mastersFromServer).map((cat)=>{
				const valueArray = mastersFromServer[cat];
				if (Array.isArray(valueArray)){
					obj[cat] = valueArray //["-"].concat(valueArray);
				}
			});

			setMastersValues(obj);
		}
		else
			setMastersValues(undefined);
	}

	useEffect(()=>{
		//get user permissions
		getUserInfo().then(res=>{
			const id = res["_userId"];
			getSingleUser(id).then(res=>{
				if (res.status==200)
					setUserPermissions(res.obj["UP"])
			})
		})
	},[]);

	useEffect(()=>{
		//get new masters
    if (changeInMasters){
      getMasters().then(()=>{
				setChangeInMasters(false);
			})
  	}
  },[changeInMasters]);


	useEffect(()=>{
		//get socket
		socketConnector(socket,setSocketIsConnected);
	},[]);


	useEffect(()=>{
		if (!userPermissions){
			const arr = [];
			arr.push(allComponents[0]);
			arr.push(allComponents[5]);
			arr.push(allComponents[26]);
			setComponentList(arr);
			return;
		}
		
			const arr = [];
		arr.push(allComponents[0]);
		arr.push(allComponents[5])
		for (let i=0; i<allComponents.length; i++){
			const singleComponent = allComponents[i];
			const componentPermissions = userPermissions[getModSecName({inputName:singleComponent.name, inputType:"fullname",outputType:"shortname"})];
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
		arr.push(allComponents[17]);
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

	const removeStatusFromMasters = (ipObj:FieldValues):MastersValues => {
		const opObj:MastersValues = {
			LoanProductList: [],
			ZoneList: [],
			FileTypeList: [],
			IndustryList: [],
			LoanTypeList: [],
			ProjectStatusList: [],
			DSRAFormList: [],
			LoanSecurityTypeList: [],
			BankAccountTypeList: [],
			ContactTypeList: [],
			EmailRecipientList: [],
			RatingAgencyList: [],
			RatingTypeList: [],
			RatingOutlookList: [],
			TransactionCategoryList: [],
			ComplianceCategoryList: [],
			CovenantCategoryList: [],
			CovenantTypeList: [],
			ConditionPrecedentCategoryList: [],
			ConditionSubsequentCategoryList: [],
			DocumentRejectionReasonList: [],
			TableRowsPerPage: []
		};

		for (let i=0; i<Object.keys(ipObj).length; i++){
			const key = Object.keys(ipObj)[i];
			const val = ipObj[key];
			const label = mastersKeyToLabels[key] as keyof MastersValues;
			opObj[label] =["-"].concat(val.map((v:FieldValues)=>v.V));
		}

		return opObj;
	}

	return (
		<PermissionContext.Provider value={{userPermissions:userPermissions||{}}}>
			<MasterValuesContext.Provider value={removeStatusFromMasters(mastersValues||{})}>
				<div className='relative'>
					<div style={{ width:"280px", float: "left", height: "100vh", position: "fixed", overflow:"auto" }} className="bg-custom-1">
						<SidePanel componentList={componentList} token={token} />
					</div>
					
					<div style={{marginLeft:"280px"}}>
						<TopPanel token={token} socketIsConnected={socketIsConnected} />
						<hr />
						<Content componentList={componentList} masterLists={mastersValues} mastersId={mastersId} setChangeInMasters={setChangeInMasters} />
					</div>
				</div>
			</MasterValuesContext.Provider>
		</PermissionContext.Provider>
	)
}

export default MenuRouter;