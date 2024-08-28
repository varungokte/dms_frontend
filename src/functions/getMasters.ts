import { MastersMapping } from './Constants';
import useGlobalContext from './GlobalContext';

const getMasters = async (setMasterLists:Function, setMastersIdList:Function,) => {

	const {getMastersList} = useGlobalContext();

  const res = await getMastersList();
  if (res.status==200){
    //console.log("masters response",res);
    const obj:any={};
    const idArr:string[]=[];
    res.obj[0]["data"].map((cat:any)=>{obj[cat.N]=cat.V; idArr.push(cat._id);});
    for (let i=0; i<Object.keys(obj).length; i++){
			const cat = Object.keys(obj)[i];
			const vals = obj[cat];
			if ((Object.keys(MastersMapping).includes(cat))){
				while (MastersMapping[cat].length>1)
					MastersMapping[cat].pop()
				MastersMapping[cat].push(...vals);
			}
		}
    setMasterLists(obj);
    //console.log("MASTERS",obj);
    setMastersIdList(idArr);
  }
  else
    setMasterLists({});
}

export default getMasters;