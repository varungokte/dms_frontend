import axios from 'axios';
import { apiEndpoint } from '@/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleEncryption, handleDecryption } from '@/functions/handleCryptogaphy';

const addRole = async (data:object) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/addRole`, {data: enc_data}, {
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

const getRolesList = async () => {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/listRole`, {
			headers:{ "Authorization": `Bearer ${token}` },
		});
		const decryptedObject = await handleDecryption(response.data);
		
		return {status:response.status, data:decryptedObject||null};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, data:null};
		else
			return {status:error.response.status, data:null};
	}
}

export { addRole, getRolesList };