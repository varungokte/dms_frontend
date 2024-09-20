import axios from 'axios';
import { apiEndpoint } from '@/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleEncryption, handleDecryption } from '@/functions/handleCryptogaphy';

const addPaymentSchedule = async (data:any) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/updatePaymentDetails`, {data: enc_data}, {
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

const getPaymentSchedule = async (loanId:string) =>  {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/listPaymentDetails`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:{_loanId:loanId}
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

export {addPaymentSchedule, getPaymentSchedule};