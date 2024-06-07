import useGlobalContext from "./../../../../GlobalContext";

const addDocument = async(userValues:any,loanId:string, sectionName:string) => {
  const { addDocument } = useGlobalContext();

  userValues["_loanId"] = loanId;
  userValues["SN"] = sectionName;
  console.log("FINAL SUBMIT")
  const res = await addDocument(userValues);
  
  return res;
}

const editDocument = async(userValues:any,currId:string, sectionName:string) => {
  const { addDocument } = useGlobalContext();

  userValues["_id"] = currId;
  userValues["SN"] = sectionName; 
 
  const res = await addDocument(userValues);
  
  return res;
}

const uploadFile = async (userFiles:any,AID:string, sectionName:string, docId:string) => {
  const { uploadFile } = useGlobalContext();

  const formData = new FormData();
  
  for (let i=0; i<userFiles.length; i++)
    formData.append("file", userFiles[i][0]);
  
  const res = await uploadFile(formData, `${AID}/${sectionName}`,docId);
  
  return res;
}

const showList = async (loanId:string,sectionName:string,) => {
  const { getDocumentsList } = useGlobalContext();

  const res = await getDocumentsList(loanId,sectionName);
  console.log("REPSONE",res)
  if (res.status==200)
    return await res.obj;
  else 
    return [];
}

const deleteDocument = async (AID:string,docId:string, sectionName:string, fileName:string) => {
  const { deleteDocument } = useGlobalContext();

  console.log("DELETE",AID,docId, fileName,sectionName)

  const res = await deleteDocument(AID, docId, sectionName, fileName);
  return res;
}

/* const getFiles = async (AID:string, ) => {
  const {getFileList}  = useGlobalContext();

  const res = getFileList(AID,sectionName,"")
}
 */

export { addDocument, editDocument, deleteDocument, uploadFile, showList };