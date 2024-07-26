import useGlobalContext from './../GlobalContext';

const getMasters = async (setMasterLists:Function, setMastersIdList:Function,) => {

	const {getMastersList} = useGlobalContext();

  const res = await getMastersList();
  if (res.status==200){
    //console.log("masters response",res);
    const obj:any={};
    const idArr:string[]=[];
    res.obj[0]["data"].map((cat:any)=>{obj[cat.N]=cat.V; idArr.push(cat._id);});
    setMasterLists(obj);
    //console.log("MASTERS",obj);
    setMastersIdList(idArr);
  }
  else
    setMasterLists({});
}

export default getMasters;