import axios from 'axios';
import { apiEndpoint } from '@/functions/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleEncryption, handleDecryption } from '@/functions/handleCryptogaphy';
import { FieldValues } from '@/types/DataTypes';

const addDocument =  async (data:FieldValues) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);

		const response = await axios.post(`${apiEndpoint}/addDocsDetails`, {data:enc_data}, {
			headers:{ "Authorization": `Bearer ${token}`}
		});
		console.log("response",response);
		const decryptedObject = await handleDecryption(response.data);
		console.log("add document","decrypted obj",decryptedObject,"id",decryptedObject["_id"])
		return {status:response.status, id:decryptedObject||""};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, id:""};
		else
			return {status:error.response.status, id:""};
	}
};

const editDocument =  async (data:FieldValues) => {
	try {
		const token = getEncryptedToken();
		//console.log("edit data",data)
		const enc_data = await handleEncryption(data);

		const response = await axios.post(`${apiEndpoint}/editDocsDetails`, {data:enc_data}, {
			headers:{ "Authorization": `Bearer ${token}`}
		});
		const decryptedObject = await handleDecryption(response.data);
		return {status:response.status, id:decryptedObject["_id"] as string||""};
	}

	catch(error:any) {
		if (!error.response)
			return {status:0, id:""};
		else
			return {status:error.response.status as number, id:""};
	}
};

const getDocumentsList = async (data:{loanId:string, sectionName:string, currentPage:number, rowsPerPage:number,searchString:string, searchType:string}) =>  {
	try {
		const token = getEncryptedToken();
		const obj:FieldValues = {};
		obj["SN"] = data.sectionName;
		obj["_loanId"]=data.loanId;
		obj["page"] = data.currentPage;
		obj["limit"] = data.rowsPerPage;
		if (data.searchString!="")
			obj["value"] = data.searchString;
		if (data.searchType!="")
			obj["type"] = data.searchType;
		
		const response = await axios.get(`${apiEndpoint}/listDocsDetail`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj
		});
		const decryptedObject = await handleDecryption(response.data);
		
		return {status: response.status, obj:decryptedObject||null}; 
	}
	catch(error:any) {
		if (!error.response)
			return {status: 0, obj:null};
		else
			return {status: error.response.status, obj:null};;
	}
};

export{ addDocument, editDocument, getDocumentsList }