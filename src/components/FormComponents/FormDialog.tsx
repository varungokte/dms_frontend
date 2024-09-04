import { memo, useEffect, useState } from "react";
import { FieldValues, FormDialogTypes, UserSuggestionTypes, UserSuggestionsList } from "@/types/DataTypes";
import { FieldAttributesList } from "@/types/FormAttributes";
import { getUserSuggestions } from "@/apiFunctions/suggestionAPIs";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import RequiredFieldsNote from "../BasicMessages/RequiredFieldsNote";
import SubmitButton from "../BasicButtons/SubmitButton";
import FormFieldsRender from "./FormFieldsRender";
import CancelButton from "../BasicButtons/CancelButton";
import CloseIcon from '@mui/icons-material/Close';
import {getFormFieldByType} from "@/functions/getFormField";
import reorganizePermissions from "@/functions/reorganizePermissions";
import { getSingleUser } from "@/apiFunctions/userAPIs";
import { getSingleContact } from "@/apiFunctions/contactAPIs";
import { getRolesList } from "@/apiFunctions/roleAPIs";

type FormDialogProps = {
  index:number, type:FormDialogTypes, edit?:boolean,  
  formOpen:boolean, setFormOpen:Function,
  formSize:"sm"|"md"|"lg", formTitle:string, 
  submitButton:string, formSubmit:Function, 
  form:FieldAttributesList, 
  currentFields:FieldValues, repeatFields?:boolean, 
  suggestions?:UserSuggestionTypes, getRoles?:boolean 
}

function FormDialog(props:FormDialogProps){
  const [prefillValues, setPrefillValues] = useState<FieldValues>({});
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [errorList, setErrorList] = useState<string[]>([]);

  useEffect(()=>{
    if (!props.formOpen)
      setPrefillValues({});
  },[props.formOpen]);

  const findMissingFields = () => {
    const data:FieldValues={};
    for (let i=0; i<props.form.length; i++){
      const field = props.form[i];
      if (field.category=="single")
        data[field.id] = field["required"]?true:false;
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          data[gridField.id] = gridField["required"]?true:false;
        }
      }
    }
    return data;
  }

  const validateRequiredFields=()=>{
    const requiredList = findMissingFields();
    let data;
    const arr=[];
    for (let i=0;i<Object.keys(requiredList).length;i++){
      let key = Object.keys(requiredList)[i];
      let value = requiredList[key];
      data = {...prefillValues};

      if (key=="P" && props.edit)
        continue;
      
      //console.log("RECENTLY ASSIGEND DATA",data);
      if (value && (!(Object.keys(data).includes(key)) || data[key]=="" || data[key]==-1))
        arr.push(key);
    }

    if (arr.length>0){
      setErrorMessage(<p className="text-red-600">Please fill all required fields.</p>);
      setErrorList(arr);
      return false;
    }
    else{
      setErrorMessage(<></>);
      return true;
    }
  }

  
  const closeDialog = () => {
    props.setFormOpen((curr:boolean[])=>{
      curr[props.index]=false;
      return [...curr];
    });
  }

  const submitFunction = async () => {
    const okToSubmit = validateRequiredFields();
    if(okToSubmit){
      //console.log("prefillValues",prefillValues)
      //console.log("submitFunction data",prefillValues,props.index);

      const obj = /* reorganizePermissions.outgoing */({...prefillValues});
      
      const res = await props.formSubmit(obj,props.index);

      //console.log("submitFunction response",res,prefillValues);

      if (res==200 || res==403)
        closeDialog();
      else if (res==422)
        setErrorMessage(<p className="text-red-600">Already exists.</p>);
      else 
        setErrorMessage(<p className="text-yellow-600">Something went wrong.</p>);
      return res;
    }
  }
  return (
    <Dialog open={props.formOpen} onClose={closeDialog} key={props.index} maxWidth={props.formSize} fullWidth>
      <DialogTitle className="flex flex-row">
        <div className="text-2xl font-normal flex-auto">{props.formTitle}</div>
        <div><button onClick={closeDialog}><CloseIcon/></button></div>
        </DialogTitle>
      <hr/>
      <div className="p-5">
        <RequiredFieldsNote />
        <RenderForm key={"f0"} edit={props.edit||false} formType={props.type} currentFields={props.currentFields} form={props.form} prefillValues={{...prefillValues}} setPrefillValues={setPrefillValues} errorList={errorList} suggestions={props.suggestions} getRoles={props.getRoles} formSubmit={props.formSubmit} />
        {errorMessage}
        <br/>
        <div className="flex flex-row">
          <div className="flex-auto"></div>
          <CancelButton onClick={closeDialog} />
          <SubmitButton submitFunction={submitFunction} submitButtonText={props.submitButton} />
        </div>
      </div>
    </Dialog>
  )
}

function RenderForm(props:{ edit:boolean, formType:FormDialogTypes, currentFields:FieldValues, form:FieldAttributesList, prefillValues:FieldValues, setPrefillValues:React.Dispatch<React.SetStateAction<FieldValues>>
  , errorList:string[], suggestions?:UserSuggestionTypes, getRoles?:boolean, formSubmit?:Function}){
  const [roles, setRoles] = useState<FieldValues[]>();

  const [allSuggestions, setAllSuggestions] = useState<UserSuggestionsList>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<UserSuggestionsList>([]);
  const [oldZone, setOldZone] = useState("");

  const listRoles = async () => {
    const res = await getRolesList();
    if (res.status==200){
      const arr = await res.data[0]["data"].map((obj:FieldValues)=>{
        const permissionObj = JSON.parse(obj["P"]?.toString()||"");
        obj["P"] = permissionObj;
        return obj;
      });
      setRoles(arr);
    }
    else
    setRoles([]);
  };

  const listSuggestions = async (suggestionType?:UserSuggestionTypes) => {
    const res = await getUserSuggestions(suggestionType?suggestionType:props.suggestions||"RM");
    //console.log("sugg",props.suggestions, res.obj)
    if (res.status==200)
      setAllSuggestions(res.obj);
    else
      return [];
  }

  const filterSuggestions = (suggestionsList:any) => {
    const arr:any=[];
    let restrictedByZone = false;
    if (props.formType=="user"){
      arr.push({label:"root",values:{E:"root", N:"root"}});
      restrictedByZone=true;
    }

    for (let i=0; i<suggestionsList.length; i++){
      const obj = suggestionsList[i];
      if (!restrictedByZone || (restrictedByZone && props.prefillValues && obj.Z==props.prefillValues["Z"]))
        arr.push({label:`${obj.N}<${obj.E}>`, values:obj})
    }
    setFilteredSuggestions(arr);
  }

  //useEffect(()=>console.log("filtered suggestions",filteredSuggestions),[filteredSuggestions])

  const getUserData = async () => {
    const res = await getSingleUser(props.currentFields["_id"]);
    if (res.status==200){
      console.log("single user data",res.obj);
      let permissionsField = getFormFieldByType(props.form,"permissions");
      if (!permissionsField)
        permissionsField = getFormFieldByType(props.form,"role");
      if (permissionsField){
        const id = permissionsField.type=="role"?permissionsField.permissionId||"UP":permissionsField.id;
        const permissions = res.obj[id];
        const obj = reorganizePermissions.incoming(permissions);
        res.obj[id] = {...obj};
      }
      props.setPrefillValues({...res.obj});
      setOldZone("");
    }
    else
      props.setPrefillValues({});
  }

  const getContactData = async () => {
    const res = await getSingleContact(props.currentFields["_id"]);
    if (res.status==200)
      props.setPrefillValues({...res.data});
    else
      props.setPrefillValues({});

  }

  useEffect(()=>{
    if (props.edit&& props.formType=="user")
      getUserData();
    
    else if (props.edit && props.formType=="cont")
      getContactData();

    if (props.getRoles)
      listRoles();

    if (props.suggestions)
      listSuggestions();

    if (!props.edit){
      console.log("CHECK PERMISSIONS")
      callReorganizePermissions();
    }
  },[]);

  const callReorganizePermissions = () => {
    let permissionsField = getFormFieldByType(props.form,"permissions");
    if (!permissionsField)
      permissionsField = getFormFieldByType(props.form,"role");
    if (permissionsField){
      const id = permissionsField.type=="role"?permissionsField.permissionId||"UP":permissionsField.id;
      const permissions = props.prefillValues[id];
      const obj = reorganizePermissions.incoming(permissions);
      props.setPrefillValues((curr)=>{
        curr[id] = {...obj};
        return {...curr};
      })
    }
  }

  useEffect(()=>{
    if (props.prefillValues["R"] && props.prefillValues["R"]!="")
      callReorganizePermissions();
  },[props.prefillValues["R"]])

  useEffect(()=>{
    if (props.formType=="cont" && props.prefillValues && props.prefillValues["add-same"]){
      props.setPrefillValues((curr:FieldValues)=>{
        curr["RA"] = curr["RA"] || curr["BA"];
        curr["RP"] = curr["RP"] || curr["BP"];
        curr["RCC"] = curr["RCC"]|| curr["BCC"];
        curr["RS"] = curr["RS"] || curr["BS"];
        curr["RC"] = curr["RC"] || curr["BC"];

        curr["BA"] = curr["RA"] 
        curr["BP"] = curr["RP"] 
        curr["BCC"] = curr["RCC"]
        curr["BS"] = curr["RS"] 
        curr["BC"] = curr["RC"] 
        return {...curr}; 
      })
    }
  },[props.prefillValues["add-same"]]);

  useEffect(()=>{
    filterSuggestions(allSuggestions);
  },[allSuggestions,props.prefillValues["Z"]])

  useEffect(()=>{
    if (props.prefillValues && oldZone && props.prefillValues["Z"]!=oldZone){
      props.setPrefillValues((curr:any)=>{
        delete curr["RM"];
        return {...curr};
      })
    }
  },[oldZone]);

  useEffect(()=>{
    if (props.currentFields && Object.keys(props.currentFields).length!=0)
      props.setPrefillValues({...props.currentFields});
  },[props.currentFields]);

  if (props.edit && Object.keys(props.prefillValues).length==0)
    return <></>
  else
    return <FormFieldsRender form={props.form} formType={props.formType} prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} edit={props.edit} filteredSuggestions={filteredSuggestions} roles={roles} setOldZone={setOldZone} errorList={props.errorList}  />  
}

export default memo(FormDialog);