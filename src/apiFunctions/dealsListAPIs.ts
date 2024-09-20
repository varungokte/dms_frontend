import axios from 'axios';
import { apiEndpoint } from '@/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleDecryption } from '@/functions/handleCryptogaphy';
import { FieldValues } from '@/types/DataTypes';

const getUserDealsList =async (data:{userEmail:string, sectionName:string, currentPage?:number, rowsPerPage?:number}) =>  {
	try {
		const token = getEncryptedToken();

		const obj:FieldValues = {};
		obj["E"] = data.userEmail
		obj["SN"]=data.sectionName;
		obj["page"] = data.currentPage || 1;
		obj["limit"] = data.rowsPerPage || 10;

		const response = await axios.get(`${apiEndpoint}/mst/assignlistDocsDetail`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj
		});
		const decryptedObject = await handleDecryption(response.data);
		
		if (response.status==200)
			return {status: response.status, obj:decryptedObject}; 
		else
			return {status: response.status, obj:null};
	}
	catch(error:any) {
		if (!error.response)
			return {status: 0, obj:null};
		else 
			return {status: error.response.status, obj:null};
	}
};

const getDealList = async (data:{admin?:boolean, sectionName:string, teamRole:string, currentPage?:number, rowsPerPage?:number}) =>  {
	try {
		const token = getEncryptedToken();

		const obj:FieldValues = {};
		obj["SN"]=data.sectionName;
		obj["page"] = data.currentPage || 1;
		obj["limit"] = data.rowsPerPage || 10;

		//console.log("Data",data)

		const route = data.admin?"mst/listDocsDetail":"assignlistDocsDetail"
		
		const response = await axios.get(`${apiEndpoint}/${route}`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj
		});
		const decryptedObject = await handleDecryption(response.data);
		
		if (response.status==200)
			return {status: response.status, obj:decryptedObject}; 
		else
			return {status: response.status, obj:null};
	}
	catch(error:any) {
		if (!error.response)
			return {status: 0, obj:null};
		else 
			return {status: error.response.status, obj:null};
	}
};

export {getDealList, getUserDealsList }