import axios from 'axios';
import { apiEndpoint } from '@/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { FieldValues } from '@/types/DataTypes';

const addFile = async (args:{data:FieldValues,AID:string, sectionKeyName:string, docId:string|number, loanId?:string, isPayment?:boolean}) => {
	try {
		const token = getEncryptedToken();
		const query:FieldValues = { "LOC":`${args.AID}/${args.sectionKeyName}`};
		
		if (args.isPayment) 
			query["POS"]=args.docId;
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
};

const getSingleFile = async (AID:string,section_name:string, file_name:string) => {
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

const deleteFile = async (args:{AID:string, docId?:string|number, index?:number|string, sectionKeyName:string, fileName:string}) => {
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
};

export {addFile, getSingleFile, deleteFile};