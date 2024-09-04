/* import axios from 'axios';
import { FieldValues } from '@/types/DataTypes';
import { apiEndpoint } from './Constants';
import { getEncryptedToken } from './getToken';
import { handleDecryption, handleEncryption } from './handleCryptogaphy'; */

//SUGGESTIONS
/* const getUserSuggestions = async (type:UserSuggestionTypes, teamLead?:string) => {
	try {
		const query:FieldValues = {type:type};
		if (teamLead)
			query["RM"]=teamLead;
		const token = getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/suggestion`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: query
		});
		const decryptedObject = await handleDecryption(response.data);
		if (response.status==200)
			return {status:200, obj:decryptedObject}
		else
			return {status:response.status, obj:null}
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, obj:null}
		else
			return {status:error.response.status, obj:null}
	}
}; */

//AUTH
/* const registerAdmin = async (data:object) => {
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

const verifyOTP = async (otp:any) => {
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
} */

//USER MANAGEMENT
/* const addUser = async (data:object) => {
	//Conflict Error 409 -> Duplicate User
	//Forbidden 403 -> User is not admin
	try {
		const enc_data = await handleEncryption(data);
		
		const token = getEncryptedToken();
		
		const response = await axios.post(`${apiEndpoint}/addUser`,{data:enc_data}, {
			headers:{ "Authorization": `Bearer ${token}` }
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

const editUser = async (data:object) => {
	try {
		const token = await getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/editUser`,{data:enc_data}, {
			headers:{
				"Authorization": `Bearer ${token}`
			}
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

const getUsers = async (data:{currentPage:number, rowsPerPage:number,searchString:string, searchType:string}) => {
	try {
		const obj:FieldValues = {};
		//console.log("Data",data)
		obj["page"] = data.currentPage;
		obj["limit"] = Number(data.rowsPerPage);
		if (data.searchString!="")
			obj["value"] = data.searchString;
		if (data.searchType!="")
			obj["type"] = data.searchType;
		const token = await getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/listUser`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj
		});
		const decryptedObject = await handleDecryption(response["data"]);
		//console.log("REQ",obj,"RES",decryptedObject)
		return {status:response.status, obj:decryptedObject||{}};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, obj:{}};
		else
			return {status:error.response.status, obj:{}}
	}
}
const getSingleUser = async (id:string) => {
	try {
		const token = await getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/getUser`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:{"_id":id}
		});
		const decryptedObject = await handleDecryption(response["data"]);
		//console.log("single user",decryptedObject);
		return {status:response.status, obj:decryptedObject||{}};
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, obj:{}};
		else
			return {status:error.response.status, obj:{}}
	}
} */

/* //LOAN ACCOUNT
const getLoanList = async (data:{currentPage:number, rowsPerPage:number, filterType?:"Z"|	"P", filterCategory?:string|string[], searchString:string, searchType:string}) => {
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

const getLoanFields = async (loanId:string) => {
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
} */
/* 
//CONTACT DETAILS
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
} */
/* 
//RATINGS
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
} */
/* 
//ROLE MANAGEMENT
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
} */
/* 
//TEAM MANAGEMENT
const getTeamsList = async (data:{loanId?:string, currentPage:number, rowsPerPage:number, searchString:string,searchType:string}) => {
	try {
		const token = await getEncryptedToken();
		
		const obj:FieldValues = {};
		if (data.loanId)
			obj["_loanId"]=data.loanId;
		obj["page"] = data.currentPage||1;
		obj["limit"] = data.rowsPerPage||10;
		if (data.searchString!="")
			obj["value"] = data.searchString;
		if (data.searchType!="")
			obj["type"] = data.searchType;

		const response = await axios.get(`${apiEndpoint}/listTeam`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj
		});

		const decryptedObject = await handleDecryption(response.data);

		return {status:response.status,obj:decryptedObject};	
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, obj:null}
		else
			return {status:error.response.status,obj:null};
	}
};

const addTeam = async (data:any) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/addTeam`, {data: enc_data}, {
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
const editTeam = async (data:any) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/editTeam`, {data: enc_data}, {
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

const getSingleTeam = async (teamId:string) => {
	try {
		const token = await getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/getTeam`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:{_id:teamId}
		});
		const decryptedObject = await handleDecryption(response.data);

		return {status:response.status,obj:decryptedObject};	
	}
	catch(error:any) {
		if (!error.response)
			return {status:0, obj:null}
		else
			return {status:error.response.status,obj:null};
	}
}; */
/* 
//DOCUMENTS
const addDocument =  async (data:any) => {
	try {
		const token = getEncryptedToken();

		const enc_data = await handleEncryption(data);

		const response = await axios.post(`${apiEndpoint}/addDocsDetails`, {data:enc_data}, {
			headers:{ "Authorization": `Bearer ${token}`}});
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
			headers:{ "Authorization": `Bearer ${token}`}});

		const decryptedObject = await handleDecryption(response.data);
		return {status:response.status, id:decryptedObject["_id"] as string||""};
	}

	catch(error:any) {
		if (!error.response)
			return {status:0, id:""};
		else
			return {status:error.response.status as number, id:""};
	}
}; */
/* 
const uploadFile = async (args:{data:FieldValues,AID:string, sectionKeyName:string, docId:string|number, loanId?:string, isPayment?:boolean}) => {
	try {
		const token = getEncryptedToken();
		
		const query:FieldValues = { "LOC":`${args.AID}/${args.sectionKeyName}`};
		
		if (args.isPayment) query["POS"]=args.docId;

		if (args.loanId)
			query["_id"]=args.loanId;
		else
			query["_id"]=args.docId;
		
		const response = await axios.post(`${apiEndpoint}/uploadDocs`, args.data, {
			headers:{ "Authorization": `Bearer ${token}`, "Content-Type": 'multipart/form-data' },
			params: query
		});

		return response.status as number;
	}

	catch(error:any) {
		if (!error.response)
			return 0;
		else
			return error.response.status as number;
	}
}; */
/* 
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
}; */

/* const getFileList = async (AID:string,section_name:string, document_category:string) => {
	try {
		const token = getEncryptedToken();

		const response = await axios.get(`${apiEndpoint}/listDocs`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: { LOC: `${AID}/${section_name}/${document_category}` }
		});
		const decryptedObject = await handleDecryption(response.data);
		if (response.status==200)
			return {status: response.status, obj:decryptedObject}; 
		else
			return {status: 0, obj:null};
	}
	catch(error:any) {
		if (!error.response)
			return {status: 0, obj:null};
		else
			return {status: error.status, obj:null};
	}
} */
/* 
const fetchDocument = async (AID:string,section_name:string, file_name:string) => {
	try {
		const token = getEncryptedToken();
		//console.log(`${AID}/${section_name}/${file_name}`)
		const response = await axios.get(`${apiEndpoint}/viewDocs`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params: { LOC: `${AID}/${section_name}/${file_name}` },
			responseType: 'blob',
		});
		const blob = new Blob([response.data], {type:response.data.type});
		return {status:response.status, file:blob, type:response.data.type};

	} 
	catch(error:any) {
		if (!error.response)
			return{status:0, file:undefined, type:""};
		else
			return {status:error.response.status, file:undefined, type:""}
	}
};

const deleteDocument = async (args:{AID:string, docId?:string|number, index?:number|string, sectionKeyName:string, fileName:string}) => {
	const params:FieldValues = {LOC:`${args.AID}/${args.sectionKeyName}/${args.fileName}`};
	if (args.docId!=undefined)
		params["_id"] = args.docId;
	if (args.index!=undefined)
		params["POS"] = args.index;
	//console.log("parameters",params);

	try {
		const token = getEncryptedToken()
		const response = await axios.delete(`${apiEndpoint}/deleteDocs`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params
		});

		return response.status as number;
	}

	catch(error:any) {
		if (!error.response)
			return 0;
		else
			return error.response.status as number || 0;
	}
}
 */
/* const getUserAssignments =async (data:{userEmail:string, sectionName:string, currentPage?:number, rowsPerPage?:number}) =>  {
	try {
		const token = getEncryptedToken();

		const obj:FieldValues = {};
		obj["E"] = data.userEmail
		obj["SN"]=data.sectionName;
		obj["page"] = data.currentPage || 1;
		obj["limit"] = data.rowsPerPage || 10;

		const response = await axios.get(`${apiEndpoint}/mst/assignlistDocsDetail`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj
		});
		const decryptedObject = await handleDecryption(response.data);
		
		if (response.status==200)
			return {status: response.status, obj:decryptedObject}; 
		else
			return {status: response.status, obj:null};
	}
	catch(error:any) {
		if (!error.response)
			return {status: 0, obj:null};
		else 
			return {status: error.response.status, obj:null};
	}
};

const getDealList = async (data:{admin?:boolean, sectionName:string, teamRole:string, currentPage?:number, rowsPerPage?:number}) =>  {
	try {
		const token = getEncryptedToken();

		const obj:FieldValues = {};
		obj["SN"]=data.sectionName;
		obj["page"] = data.currentPage || 1;
		obj["limit"] = data.rowsPerPage || 10;

		//console.log("Data",data)

		const route = data.admin?"mst/listDocsDetail":"assignlistDocsDetail"
		
		const response = await axios.get(`${apiEndpoint}/${route}`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj
		});
		const decryptedObject = await handleDecryption(response.data);
		
		if (response.status==200)
			return {status: response.status, obj:decryptedObject}; 
		else
			return {status: response.status, obj:null};
	}
	catch(error:any) {
		if (!error.response)
			return {status: 0, obj:null};
		else 
			return {status: error.response.status, obj:null};
	}
}; */
/* 
//RELATIONSHING MAPPING
const selectTeam = async (data:any) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/selectTeam`, {data: enc_data}, {
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
} */
/* 
//MASTERS
const addToMasters = async (data:any) => {
	try {
		const token = getEncryptedToken();
		const enc_data = await handleEncryption(data);
		const response = await axios.post(`${apiEndpoint}/updateMst`, {data: enc_data}, {
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

const getMastersList = async () =>  {
	try {
		const token = getEncryptedToken();
		const response = await axios.get(`${apiEndpoint}/listMst`, {
			headers:{ "Authorization": `Bearer ${token}` },
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
}; */

/* const decrypt = async (data:object) => {
	const encryptedText = CryptoJS.AES.encrypt(JSON.stringify(data), EncryptionKey).toString();
	console.log("ENCRYPTED TEXTZ", encryptedText);
	const reqBody = {"data":encryptedText};

	const obj = await handleDecryption("U2FsdGVkX18wPWv+D83d+QrLDMwoTIwTa3u74O3wG87AtCcHErX7iuHS6Ns48w3i");
	console.log("RESULT", reqBody);
	const response = await axios.post(`${apiEndpoint}/decrypt`,reqBody);
	return obj;
}
*/
/* 
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
}; */

/* const getSpecialList = async (data:{admin?:boolean, type:"def"|"crit", sectionName:string, currentPage?:number, rowsPerPage?:number}) =>  {
	try {
		const token = getEncryptedToken();
		
		const obj:FieldValues = {};
		obj["page"] = data.currentPage || 1;
		obj["limit"] = Number(data.rowsPerPage) || 10;
		obj["SN"] = data.sectionName;
		
		let route = "";
		if (data.admin)
			route = data.type=="def"?"mst/listDefault":"mst/listCriticalCases";
		else
			route = data.type=="def"?"assignlistDefault":"assignlistCriticalCases";
		
		const response = await axios.get(`${apiEndpoint}/${route}`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:obj,
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
}; */
/* 
const useGlobalContext = () => {
	return {
	}
}

export default useGlobalContext; */