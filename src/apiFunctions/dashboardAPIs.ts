import axios from "axios";
import { apiEndpoint } from "@/Constants";
import { getEncryptedToken } from "@/functions/getToken";
import { handleDecryption } from "@/functions/handleCryptogaphy";

const getDashboardData = async () =>{
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/dashboard`, {
			headers:{ "Authorization": `Bearer ${token}` },
		});
		const decryptedObject = await handleDecryption(response.data);
    console.log("decrypted",response);
		return {status:response.status,data:decryptedObject||{}};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0,data:{}};
		else
			return {status:error.response.status, data:{}}
	}
}

export {getDashboardData};