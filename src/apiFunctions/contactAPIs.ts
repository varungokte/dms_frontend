import axios from 'axios';
import { apiEndpoint } from '@/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleEncryption, handleDecryption } from '@/functions/handleCryptogaphy';
import { FieldValues } from '@/types/DataTypes';

const addContact = async (data:object) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/updateContact`,{data:enc_data}, {
			headers:{ "Authorization": `Bearer ${token}` },
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

const getContactsList = async (data:{loanId:string,searchString:string, searchType:string}) => {
	try {
		const token = getEncryptedToken();
		const obj:FieldValues = {};
		obj["_loanId"] = data.loanId;
		if (data.searchString!="")
			obj["value"] = data.searchString;
		if (data.searchType!="")
			obj["type"] = data.searchType;

		const response = await axios.get(`${apiEndpoint}/listContact`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj,
		});
		const decryptedObject = await handleDecryption(response.data);
		return {status:response.status,data:decryptedObject||{}};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0,data:{}};
		else
			return {status:error.response.status, data:{}}
	}
};

const getSingleContact = async (id:string) =>{
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/getContact`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: { "_id": id },
		});
		const decryptedObject = await handleDecryption(response.data);
		return {status:response.status,data:decryptedObject||{}};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0,data:{}};
		else
			return {status:error.response.status, data:{}}
	}
}

const deleteContact = async (id:string) => {
	try {
		const token = getEncryptedToken();
		const response = await axios.delete(`${apiEndpoint}/deleteContact`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: { "_id": id },
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

export {addContact, getContactsList, getSingleContact, deleteContact};