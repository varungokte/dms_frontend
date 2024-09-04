import axios from 'axios';
import { apiEndpoint } from '@/functions/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleEncryption, handleDecryption } from '@/functions/handleCryptogaphy';
import { FieldValues } from '@/types/DataTypes';

const getLoansList = async (data:{currentPage:number, rowsPerPage:number, filterType?:"Z"|	"P", filterCategory?:string|string[], searchString:string, searchType:string}) => {
	try {
		const obj:FieldValues = {}
		if (data.filterType)
			obj["pageType"] = data.filterType;
		if (data.filterCategory)
			obj["pageValue"] = data.filterCategory;
		if (data.searchString!="")
			obj["value"] = data.searchString;
		if (data.searchType!="")
			obj["type"] = data.searchType;

		obj["page"] = data.currentPage;
		obj["limit"] = data.rowsPerPage;
	
		const token = getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/listLoan`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj
		});
		const decryptedObject = await handleDecryption(response.data);
		//console.log("DECRYPTED response",decryptedObject)
		return {status:response.status, arr:decryptedObject||null};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, arr:null};
		else
			return {status:error.response.status, arr:null};
	}
};

const getLoanDetails = async (loanId:string) => {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/getLoan`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: { "_loanId": loanId },
		});
		const decryptedObject = await handleDecryption(response.data);
		return {status:response.status, obj:decryptedObject||{}};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, obj:{}};
		else
			return {status:error.response.status, obj:{}};
	}
}

//CREATE LOAN ACCOUNT
const createLoan = async (data:object) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/updateLoan`,{data:enc_data}, {
			headers:{ "Authorization": `Bearer ${token}` }
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

const deleteLoan = async (loanId:string) => {
	try {
		const token = getEncryptedToken();
		const response = await axios.delete(`${apiEndpoint}/deleteLoan`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: { "_id": loanId },
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

const createAID = async (data:object) =>{
	try {
		const token = await getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/createAID`,{data:enc_data}, {
			headers:{ "Authorization": `Bearer ${token}` }
		});
		const decryptedObject = await handleDecryption(response.data);
		return {status:response.status,obj:decryptedObject};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, obj:{}};
		else
			return {status:Number(error.response.status), obj:{}};
	}
}

export {getLoansList, getLoanDetails, createLoan, createAID, deleteLoan}