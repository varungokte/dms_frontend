import axios from 'axios';
import { decodeToken, isExpired } from "react-jwt";
import CryptoJS from "crypto-js";
import { useEffect } from 'react';
const Base_Url = "https://dms-pbe2.onrender.com/api/v1/allAPI";
const encryption_key = "JAIBAJRANGBALI";

const useTitle = (title:string) => {
	useEffect(()=>{
		document.title=title+" | Beacon DMS"
	},[title])
}

const handleEncryption = async (data:object) => {
	try{
		const encryptedText = await CryptoJS.AES.encrypt(JSON.stringify(data), encryption_key).toString();
		return encryptedText;
	}
	catch(err){
		console.log(err);
	}
}

const handleDecryption = async (text:string) => {
	let decryptedString="";
	try{
		decryptedString = await CryptoJS.AES.decrypt(text, encryption_key).toString(CryptoJS.enc.Utf8);
		const obj = await JSON.parse(decryptedString);
		return await obj;
	}
	catch (err){
		return await decryptedString
	}
}

const RegisterAdmin = async (data:object) => {
	try {
		console.log(data);
		const req_body = await handleEncryption(data);
		const response = await axios.post(`${Base_Url}/addAdmin`, {data:req_body});
		console.log(response);
		return response;
	} 
	catch (error) {
		throw error;
	}
}	

//Conflict Error 409 -> User inactive; contact admin
//Precondition Failed 412 -> Incorrect Password
//Unauthorized 401 -> Incorrect Username
const LoginUser = async (data: object) => {
	try {
		const req_body = await handleEncryption(data);
		console.log("req_body", req_body);
		const response = await axios.post(`${Base_Url}/login`, {data:req_body}, {
			headers:{ "Content-type": "application/json" }
		});
		console.log("response", response)
		console.log(response.status)
		if (response.status == 200){
			localStorage.setItem("Beacon-DMS-token",response["data"]);
			return 200;
		}	
		else
			return response.status;
	} 
	catch (error) {
		console.log(error);
		//@ts-ignore
		return  error.response.status
	}
}

const getEncryptedToken = () => {
	const token = localStorage.getItem('Beacon-DMS-token');
	return token;
}

const getDecryptedToken = async () => {
	const token = getEncryptedToken();
	if (token==null)
		return null;
	const decryptedToken = await handleDecryption(token);
	console.log("decrypted", decryptedToken)
	let decodedToken;
	if (decryptedToken["TKN"])
		decodedToken = await decodeToken(decryptedToken["TKN"]);
	else
		decodedToken = await decodeToken(decryptedToken);
	console.log("decoded", decodedToken)
	const valid = isExpired(decryptedToken);
	if (!valid)
		return null;
	return await decodedToken;
}

//Error 503 -> Maintainance Mode
//Error 409 -> 
const sendOTP = async () => {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${Base_Url}/sendOTP`, {
			headers:{ "Authorization": `Bearer ${token}` }
		});
		if (response.status==200)
			return 200;
		if (response.status==503)
			return 503;
		return response.status;
	}
	catch(error){
		throw error;
	}
}

//Error 412 -> User already verified
const verifyOTP = async (otp:any) => {
	try {
		const token = await getEncryptedToken();
		const enc_otp = await handleEncryption({otp});
		const response = await axios.post(`${Base_Url}/verifyOTP`,{data: enc_otp},{
			headers:{	"Authorization": `Bearer ${token}` }
		});
		console.log(response)

		if (response.status==200){
			return {status:200, data:response["data"]}
		}
		else
			return {status:response.status, data:null}
	}
	catch(error:any){
		if (error.status)
			return {status:error.status, data:null}
	}
}

//Conflict Error 409 -> Duplicate User
//Forbidden 403 -> User is not admin
const createUser = async (data:object) => {
	try {
		console.log(data)
		const req_body = await handleEncryption(data);
		console.log("REQ_BODY", req_body)
		//@ts-ignore
		const token = getEncryptedToken();
		const response = await axios.post(`${Base_Url}/addUser`,{data:req_body}, {
			headers:{ "Authorization": `Bearer ${token}` }
		});
		console.log(response)
		return response;
	}
	catch(error:any) {
		if (!error.response)
			return;
		if (error.response.status===409)
			return "duplicate_user"
	}
}

const editUser = async (data:object) => {
	try {
		const token = await getEncryptedToken();
		const response = await axios.post(`${Base_Url}/editUser`,data, {
			headers:{
				"Authorization": `Bearer ${token}`
			}
		});
		return response;
	}
	catch(error:any) {
		if (!error.response)
			return;
		if (error.response.status===409)
			return "duplicate_user"
	}
}

const getAllUsers = async () => {
	try {
		const token = await getEncryptedToken();
		console.log("ENCRYPTED", token);
		const response = await axios.get(`${Base_Url}/listUser`, {
			headers:{ "Authorization": `Bearer ${token}` }
		});
		console.log("Response: ",response);
		const decryptedObject = handleDecryption(response["data"]);
		console.log("DECRYPTED VALUE BACK FROM FUNCTION", decryptedObject);
		return decryptedObject;
	}
	catch(error:any) {
		if (!error.response)
			return;
		if (error.response.status===409)
			return "duplicate_user"
	}
}

const createLoan = async (data:object) => {
	try {
		const token = getEncryptedToken();
		console.log("REG Data",data)
		const enc_data = await handleEncryption(data);
		console.log("ECN Data",enc_data)
		const response = await axios.post(`${Base_Url}/createLoan`,{data:enc_data}, {
			headers:{ "Authorization": `Bearer ${token}` }
		});
		return response.status;
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response.status
	}
}

const createAID = async (data:object) =>{
	try {
		const token = await getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${Base_Url}/createAID`,{data:enc_data}, {
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

const addContact = async (data:object, actionType:string) => {
	try {
		const token = getEncryptedToken();
		console.log("OBJECT",data)
		const enc_data = await handleEncryption(data);
		console.log("ACTION", actionType);
		const response = await axios.post(`${Base_Url}/createContact`,{data:enc_data}, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: { "type": actionType },
		});
		console.log("RESPONSE ",response)
		if (response.status==200)
			return response;
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response
	}
}

const getContacts = async (loanId:string) => {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${Base_Url}/listContact`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: { "_loanId": loanId },
		});
		const decryptedObject = handleDecryption(response.data);
		return decryptedObject;
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response
	}
};

const getLoanList = async () => {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${Base_Url}/listLoan`, {
			headers:{ "Authorization": `Bearer ${token}` },
		});
		const decryptedObject = handleDecryption(response.data);
		return decryptedObject;
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response;
	}
};

const getLoanFields = async (loanId:string) => {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${Base_Url}/getLoan`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: { "_loanId": loanId },
		});
		const decryptedObject = handleDecryption(response.data);
		return decryptedObject;
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response;
	}
}

const addRating = async (data:object) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${Base_Url}/addRating`, {data: enc_data}, {
			headers:{ "Authorization": `Bearer ${token}` },
		});
		return response.status;
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response;
	}
}

const getRatingsList = async (loanId:string) => {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${Base_Url}/listRating`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: { "_loanId": loanId },
		});
		const decryptedObject = handleDecryption(response.data);
		return decryptedObject; 
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response;
	}
}

const addRole = async (data:object) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${Base_Url}/addRole`, {data: enc_data}, {
			headers:{ "Authorization": `Bearer ${token}` },
		});
		return response.status;
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response;
	}
}

const getRolesList = async () => {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${Base_Url}/listRole`, {
			headers:{ "Authorization": `Bearer ${token}` },
		});
		const decryptedObject = handleDecryption(response.data);
		if (response.status==200)
			return decryptedObject; 
		else
		return null;
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response;
	}
}

const getUserSuggestions = async () => {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${Base_Url}/suggestion`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: {type: "UM"}
		});
		const decryptedObject = handleDecryption(response.data);
		if (response.status==200)
			return decryptedObject; 
		else
			return null;
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response;
	}
};


const getTeamList = async (loanId:string) => {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${Base_Url}/getTeam`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: {_loanId: loanId}
		});
		const decryptedObject = handleDecryption(response.data);
		
		if (response.status==200)
			return decryptedObject; 
		else
			return null;
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response;
	}
};

const addTeamMember = async (data:any) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${Base_Url}/addMember`, {data: enc_data}, {
			headers:{ "Authorization": `Bearer ${token}` },
		});
		return response.status;
	}
	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response;
	}
}

const createDocument = async (data:any) => {
	try {
		const token = getEncryptedToken();

		console.log("theta",data);

		for (const [key, value] of data.entries()) 
			console.log(`${key}: ${value}, ${typeof value}`);

		const response = await axios.post(`${Base_Url}/uploadTest`, data, {
			headers:{ "Authorization": `Bearer ${token}`, "Content-Type": 'multipart/form-data' },
		});

		console.log("Server response, ",response);
		return response.status;
	}

	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response;
	}
}

const deleteDocument = async (data:any) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${Base_Url}/uploadTest`, {data:enc_data}, {
			headers:{ "Authorization": `Bearer ${token}` },
		});

		console.log("Server response, ",response);
		return response.status;
	}

	catch(error:any) {
		if (!error.response)
			return;
		else
			return error.response;
	}
}

//addMember, getTeam

/* const decrypt = async (data:object) => {
	const encryptedText = CryptoJS.AES.encrypt(JSON.stringify(data), encryption_key).toString();
	console.log("ENCRYPTED TEXTZ", encryptedText);
	const reqBody = {"data":encryptedText};

	const obj = await handleDecryption("U2FsdGVkX18wPWv+D83d+QrLDMwoTIwTa3u74O3wG87AtCcHErX7iuHS6Ns48w3i");
	console.log("RESULT", reqBody);
	const response = await axios.post(`${Base_Url}/decrypt`,reqBody);
	return obj;
}
*/

const useGlobalContext = () => {
	return {
		useTitle,
		getEncryptedToken,
		getDecryptedToken,
		handleEncryption,
		handleDecryption,
		RegisterAdmin,
		LoginUser,
		sendOTP,
		verifyOTP,
		createUser,
		editUser,
		getAllUsers,
		createLoan,
		createAID,
		addContact,
		getContacts,
		getLoanList,
		getLoanFields,
		addRating,
		getRatingsList,
		addRole,
		getRolesList,
		getUserSuggestions,
		getTeamList,
		addTeamMember,
		createDocument,
		deleteDocument,
	}
}

export default useGlobalContext;