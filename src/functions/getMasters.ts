import { getMastersList } from '@/apiFunctions/masterAPIs';
import { FieldValues } from '@/types/DataTypes';

const getMasters = async (setMasterLists:Function, setMastersIdList:Function,) => {
  const res = await getMastersList();
  if (res.status==200){
    const obj:any={};
    const idObj:FieldValues={};
    res.obj[0]["data"].map((cat:FieldValues)=>{
      obj[cat["N"]]=cat["V"];
      idObj[cat["N"]] = cat["_id"]
    });
    
    setMasterLists(obj);
    setMastersIdList(idObj);
  }
  else
    setMasterLists({});
}

export default getMasters;

    /* res.obj[0]["data"].map((cat:any)=>{obj[cat.N]=cat.V; idArr.push(cat._id);});
    for (let i=0; i<Object.keys(obj).length; i++){
			const cat = Object.keys(obj)[i];
			const vals = obj[cat];
			if ((Object.keys(MastersMapping).includes(cat))){
				while (MastersMapping[cat].length>1)
					MastersMapping[cat].pop()
				MastersMapping[cat].push(...vals);
			}
		} */