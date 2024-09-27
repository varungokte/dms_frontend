import axios from "axios";
import { apiEndpoint } from "@/Constants";
import { getEncryptedToken } from "@/functions/getToken";
import { handleDecryption } from "@/functions/handleCryptogaphy";
import moment from "moment";

const getDashboardData = async () =>{
	try {
		const obj = {
			ED:moment(new Date()).format("yyyy-MM-DD"),
			SD:moment(new Date().setMonth(new Date().getMonth()-1)).format("yyyy-MM-DD")
		}
		
		const token = getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/dashboard`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj
		});
		const decryptedObject = await handleDecryption(response.data);
		return {status:response.status,data:(decryptedObject||[{}])[0]};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0,data:{}};
		else
			return {status:error.response.status, data:{}}
	}
}

export {getDashboardData};