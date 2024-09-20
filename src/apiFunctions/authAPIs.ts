import axios from 'axios';
import { apiEndpoint } from '@/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleEncryption } from '@/functions/handleCryptogaphy';

const registerAdmin = async (data:object) => {
	try {
		const req_body = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/addAdmin`, {data:req_body});
		//console.log("register response",response);
		return response.status;
	} 
	catch (error:any) {
		if (error.response)
			return error.response.status;
		else
			return 0;
	}
}	

const loginUser = async (data: object) => {
	//Conflict Error 409 -> User inactive; contact admin
	//Precondition Failed 412 -> Incorrect Password
	//Unauthorized 401 -> Incorrect Username
	try {
		const req_body = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/login`, {data:req_body}, {
			headers:{ "Content-type": "application/json" }
		});
		if (response.status == 200){
			localStorage.setItem("Beacon-DMS-token",response["data"]);
			return 200;
		}	
		else
			return response.status;
	} 
	catch (error:any) {
		if (!error.response)
			return 0;
		else
			return error.response.status;
	}
}

const sendOTP = async () => {
	//Error 503 -> Maintainance Mode
	//Error 409 -> 
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/sendOTP`, {
			headers:{ "Authorization": `Bearer ${token}` }
		});
		return response.status;
	} 
	catch (error:any) {
		if (!error.response)
			return 0;
		else
			return error.response.status;
	}
}

const verifyOTP = async (otp:number) => {
	//Error 412 -> User already verified
	try {
		const token = await getEncryptedToken();
		const enc_otp = await handleEncryption({otp});
		const response = await axios.post(`${apiEndpoint}/verifyOTP`,{data: enc_otp},{
			headers:{	"Authorization": `Bearer ${token}` }
		});

		if (response.status==200){
			return {status:200, data:response["data"]}
		}
		else
			return {status:response.status, data:null}
	}
	catch(error:any){
		if (error.response.status)
			return {status:error.status, data:null}
		else	
			return {status:0, data:null}
	}
}

export {registerAdmin, loginUser, sendOTP, verifyOTP}