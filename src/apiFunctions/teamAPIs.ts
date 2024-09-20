import axios from 'axios';
import { apiEndpoint } from '@/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleEncryption, handleDecryption } from '@/functions/handleCryptogaphy';
import { FieldValues } from '@/types/DataTypes';

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
};

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
};

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
};

const getSingleUserTeams = async (params:{email:string,}) => {
	try {
		const token = await getEncryptedToken();
		console.log('get single team params',params.email);
		const response = await axios.get(`${apiEndpoint}/userteams`, {
			headers:{ "Authorization": `Bearer ${token}` },
			params:{value:params.email}
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

export { 
	addTeam, editTeam, 
	getTeamsList, getSingleTeam, 
	selectTeam,
	getSingleUserTeams,
}