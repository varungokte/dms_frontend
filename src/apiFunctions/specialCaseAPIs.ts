import axios from 'axios';
import { apiEndpoint } from '@/Constants';
import { getEncryptedToken } from '@/functions/getToken';
import { handleDecryption } from '@/functions/handleCryptogaphy';
import { FieldValues } from '@/types/DataTypes';

const getSpecialList = async (data:{admin?:boolean, type:"def"|"crit", sectionName:string, currentPage?:number, rowsPerPage?:number}) =>  {
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
};

export { getSpecialList };