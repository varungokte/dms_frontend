import { useState, useEffect } from "react";
import { FieldValues, UserSuggestionsList } from "@/types/DataTypes";
import { FieldAttributesList } from "@/types/FormAttributes";
import { FormDialogTransferProps } from "@/types/FormComponentProps";
import { getUserSuggestions } from "@/apiFunctions/suggestionAPIs";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import FormFieldsRender from "./FormFieldsRender";

import RequiredFieldsNote from "../BasicMessages/RequiredFieldsNote";
import SubmitButton from "../BasicButtons/SubmitButton";
import CloseIcon from '@mui/icons-material/Close';

function FormDialogTransfer(props:FormDialogTransferProps){
  const [prefillValues, setPrefillValues] = useState<FieldValues>(props.currentFields);
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [errorList, setErrorList] = useState<string[]>([]);
  
  useEffect(()=>{
    if (!props.formOpen)
      setPrefillValues({});
  },[props.formOpen]);

  const closeDialog = () => {
    props.setFormOpen(false);
  }

  const findMissingFields = () => {
    const requiredFields:any={};
    for (let i=0; i<props.form.length; i++){
      const field = props.form[i];
      if (field.category=="single")
        requiredFields[field.id] = field["required"]?true:false;
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          requiredFields[gridField.id] = gridField["required"]?true:false;
        }
      }
    }
    return requiredFields;
  }

  const validateRequiredFields=()=>{
    const requiredList = findMissingFields();
    let data;
    const arr=[];

    for (let i=0;i<Object.keys(requiredList).length;i++){
      let key = Object.keys(requiredList)[i];
      let value = requiredList[key];
      data = {...prefillValues};
      
      if (value && (!(Object.keys(data).includes(key)) || data[key]=="" || data[key]==-1))
        arr.push(key);
    }

    if (arr.length>0){
      setErrorList(arr);
      setErrorMessage(<p className="text-red-600">Please fill all required fields.</p>);
      return false;
    }
    else{
      setErrorMessage(<></>);
      return true;
    }
  }

  const submitFunction = async () => {
    let okToSubmit = validateRequiredFields();

    if(okToSubmit){
      const res = await props.formSubmit({...prefillValues});
      console.log("Response",res)
      if (res==200)
        closeDialog();
      else if (res==422)
        setErrorMessage(<p className="text-red-600">Already exists.</p>);
      else 
        setErrorMessage(<p className="text-yellow-600">Something went wrong.</p>);
      return res;
    }
  }

  return (
    <Dialog open={props.formOpen} onClose={closeDialog} maxWidth={props.formSize} fullWidth>
      <DialogTitle>
        <div className="flex flex-row">
          <div className="flex-auto"><p className="text-2xl font-normal">{props.formTitle}</p></div>
          <div><button onClick={closeDialog}><CloseIcon/></button></div>
        </div>
      </DialogTitle>
      <hr/>
      <div className="p-5">
        <RequiredFieldsNote />
        <br />
        <RenderForm form={props.form} prefillValues={prefillValues} setPrefillValues={setPrefillValues} errorList={errorList} teamLeader={props.teamLeader} />
        {errorMessage}
        <br/>
        <div className="flex flex-row">
          <div className="flex-auto"></div>
          <button className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle" onClick={closeDialog}>Cancel</button>
          <SubmitButton submitFunction={submitFunction} submitButtonText={props.submitButton} />
        </div>
      </div>
    </Dialog>
  )
}

function RenderForm(props:{form:FieldAttributesList, errorList:string[], prefillValues:FieldValues, setPrefillValues:React.Dispatch<React.SetStateAction<FieldValues>>, teamLeader:string}){
  const [memberSuggestions, setMemberSuggestions] = useState<UserSuggestionsList>();

  const filterSuggestions = (suggestionsList:FieldValues[]) => {
    const arr:UserSuggestionsList=[]
    for (let i=0; i<suggestionsList.length; i++){
      const obj = suggestionsList[i];
      arr.push({label:`${obj.N}<${obj.E}>`, values:obj})
    }
    return arr;
  }

  const getTeamsSuggestions = async () => {
    const res = await getUserSuggestions("TL",props.teamLeader);
    if (res.status==200)
      setMemberSuggestions(filterSuggestions(res.obj));
  }

  useEffect(()=>{
    getTeamsSuggestions();
  },[]);

  if (!memberSuggestions)
    return;

  return <FormFieldsRender form={props.form} formType="team" errorList={props.errorList}
    prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
    filteredSuggestions={memberSuggestions}
  />
}

export default FormDialogTransfer;