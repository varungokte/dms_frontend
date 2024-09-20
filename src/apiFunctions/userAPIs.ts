import axios from 'axios';
import { apiEndpoint } from '@/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleEncryption, handleDecryption } from '@/functions/handleCryptogaphy';
import { FieldValues } from '@/types/DataTypes';

const addUser = async (data:object) => {
	//Conflict Error 409 -> Duplicate User
	//Forbidden 403 -> User is not admin
	try {
		const enc_data = await handleEncryption(data);
		const token = getEncryptedToken();
		
		const response = await axios.post(`${apiEndpoint}/addUser`,{data:enc_data}, {
			headers:{ "Authorization": `Bearer ${token}` }
		});
		
		return response.status;
	}
	catch(error:any) {
		if (!error.response)
			return 0;
		else
			return error.response.status;
	}
}

const editUser = async (data:object) => {
	try {
		const token = await getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/editUser`,{data:enc_data}, {
			headers:{
				"Authorization": `Bearer ${token}`
			}
		});
		return response.status;
	}
	catch(error:any) {
		if (!error.response)
			return 0;
		else
			return error.response.status
	}
}

const getUsersList = async (data:{currentPage:number, rowsPerPage:number,searchString:string, searchType:string}) => {
	try {
		const obj:FieldValues = {};
		//console.log("Data",data)
		obj["page"] = data.currentPage;
		obj["limit"] = Number(data.rowsPerPage);
		if (data.searchString!="")
			obj["value"] = data.searchString;
		if (data.searchType!="")
			obj["type"] = data.searchType;
		const token = await getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/listUser`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj
		});
		const decryptedObject = await handleDecryption(response["data"]);
		//console.log("REQ",obj,"RES",decryptedObject)
		return {status:response.status, obj:decryptedObject||{}};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, obj:{}};
		else
			return {status:error.response.status, obj:{}}
	}
}
const getSingleUser = async (id:string) => {
	try {
		const token = await getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/getUser`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:{"_id":id}
		});
		const decryptedObject = await handleDecryption(response["data"]);
		//console.log("single user",decryptedObject);
		return {status:response.status, obj:decryptedObject||{}};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, obj:{}};
		else
			return {status:error.response.status, obj:{}}
	}
}

export {addUser, editUser, getUsersList, getSingleUser};