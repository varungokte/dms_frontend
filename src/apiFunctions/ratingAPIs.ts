import axios from 'axios';
import { apiEndpoint } from '@/functions/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleEncryption, handleDecryption } from '@/functions/handleCryptogaphy';
import { FieldValues } from '@/types/DataTypes';

const addRating = async (data:object) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/addRating`, {data: enc_data}, {
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

const getRatingsList = async (data:{loanId:string, currentPage:number, rowsPerPage:number}) => {
	try {
		const token = getEncryptedToken();

		const obj:FieldValues = {};
		if (data.loanId)
			obj["_loanId"]=data.loanId;
		obj["page"] = data.currentPage;
		obj["limit"] = data.rowsPerPage;

		const response = await axios.get(`${apiEndpoint}/listRating`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: obj
		});
		const decryptedObject = await handleDecryption(response.data);
		return {status:response.status, arr:decryptedObject}; 
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, arr:[]};
		else
			return{status: error.response.status, arr:[]};
	}
}

export {addRating, getRatingsList};