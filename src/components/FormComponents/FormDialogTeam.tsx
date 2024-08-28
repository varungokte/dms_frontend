import { useEffect, useState } from "react";
import useGlobalContext from "../../functions/GlobalContext";
import { FieldValues, UserSuggestionsList } from "@/types/DataTypes";
import { FieldAttributesList } from "@/types/FormAttributes";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import RequiredFieldsNote from "../BasicMessages/RequiredFieldsNote";
import CloseIcon from '@mui/icons-material/Close';
import SubmitButton from "../BasicButtons/SubmitButton";
import FormFieldsRender from "./FormFieldsRender";

type FormDialogProps = {
  index:number, edit?:boolean, 
  formOpen:boolean, setFormOpen:Function,
  formSize:"sm"|"md"|"lg", formTitle:string, 
  submitButton:string, formSubmit:Function, 
  form:FieldAttributesList, 
  currentFields:FieldValues, repeatFields?:boolean,
}

function FormDialogTeam(props:FormDialogProps){
  const [prefillValues, setPrefillValues] = useState<FieldValues>({});
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [errorList, setErrorList] = useState<string[]>([]);

  useEffect(()=>{
    if (!props.formOpen)
      setPrefillValues({});
  },[props.formOpen]);

  const teamMembersRenamingWhileSubmitting = () => {
    const data:FieldValues={};
    data["_id"]=prefillValues["_id"];
    data["N"]=prefillValues["N"];
    data["L"]=prefillValues["L"];
    const sections = ["TD","CD","C","CP","CS","PD"];
    for (let i=0; i<sections.length; i++){
      const section = sections[i];
      const obj = prefillValues[section];
      if (!prefillValues[`${section}M`])
        data[`${section}M`] = obj["M"];
      else
        data[`${section}M`] = prefillValues[`${section}M`].map((obj:any)=>obj.values["E"])
      if (!prefillValues[`${section}C`])
        data[`${section}C`] = obj["C"];
      else
      data[`${section}C`] = prefillValues[`${section}C`].map((obj:any)=>obj.values["E"])

    }
    //console.log("teamMembersRenamingWhileSubmitting result",data);
    return data;
  }

  const findMissingFields = () => {
    const data:any={};
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
      data = props.edit?teamMembersRenamingWhileSubmitting():{...prefillValues};

      if (key=="P" && props.edit)
        continue;
      
      //console.log("RECENTLY ASSIGEND DATA",data);
      if (value && (!(Object.keys(data).includes(key)) || data[key]=="" || data[key]==-1))
        arr.push(key);

      if (arr.length>0){
        setErrorList(arr);
        setErrorMessage(<p className="text-red-600">Please fill all required fields.</p>);
        return false;
      }
      else{
        setErrorMessage(<></>);
        if (props.edit)
          return data;
        return true;
      }
    }
  }

  const closeDialog = () => {
    props.setFormOpen((curr:boolean[])=>{
      curr[props.index]=false; 
      return [...curr];
    });
  }

  const submitFunction = async () => {
    let okToSubmit = validateRequiredFields();
    let submittedData:any = false;
    //console.log("VALIDATED",okToSubmit);
    if (typeof okToSubmit!="boolean"){
      submittedData=okToSubmit;
      okToSubmit=true;
    }
    if(okToSubmit){
      //console.log("prefillValues",prefillValues)
      const res = await props.formSubmit(submittedData==false?{...prefillValues}:submittedData,props.index);
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
    <Dialog open={props.formOpen} onClose={closeDialog} key={props.index} maxWidth={props.formSize} fullWidth>
      <DialogTitle>
        <div className="flex flex-row">
          <div className="flex-auto"><p className="text-2xl font-normal">{props.formTitle}</p></div>
          <div><button onClick={closeDialog}><CloseIcon/></button></div>
        </div>
      </DialogTitle>
      <hr/>
      <div className="p-5">
        <RequiredFieldsNote />
          <RenderForm key={"f0"} edit={props.edit||false} teamId={props.currentFields["_id"]} form={props.form} prefillValues={{...prefillValues}} setPrefillValues={setPrefillValues} errorList={errorList} />
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

function RenderForm(props:{ edit:boolean, teamId:string, form:FieldAttributesList, prefillValues:FieldValues, setPrefillValues:Function, errorList:string[]}){
  const [leaderSuggestions, setLeaderSuggestions] = useState<UserSuggestionsList>([]);
  const [memberSuggestions, setMemberSuggestions] = useState<UserSuggestionsList>([]);
  const [teamMembers, setTeamMembers] = useState<FieldValues>({});

  const {getUserSuggestions, getSingleTeam} = useGlobalContext();

  const filterSuggestions = (suggestionsList:FieldValues[]) => {
    const arr:UserSuggestionsList=[]
    for (let i=0; i<suggestionsList.length; i++){
      const obj = suggestionsList[i];
      arr.push({label:`${obj.N}<${obj.E}>`, values:obj})
    }
    return arr;
  }

  const getLeaderSuggestions = async () => {
    const res = await getUserSuggestions("RM");
    if (res.status==200){
      const arr = filterSuggestions(res.obj)
      setLeaderSuggestions(arr);
    }
    else
      setLeaderSuggestions([]);
  }

  const getMemberSuggestions = async () => {
    const leadName = props.edit?props.prefillValues["L"]:props.prefillValues["L"].values["E"];
    const res = await getUserSuggestions("TL",leadName);
    if (res.status==200){
      const arr = filterSuggestions(res.obj);
      setMemberSuggestions(arr);
    }
    else
      setMemberSuggestions([]);
  }

  const getTeamData = async () => {
    const res = await getSingleTeam(props.teamId);
    if (res.status==200){
      res.obj["_id"]=props.teamId;
      props.setPrefillValues({...res.obj});
      getLeaderSuggestions();
    }
    else
      props.setPrefillValues({});
  }

  const teamMembersCombinedToSeparate = () => {
    const data:any={};
    data["_id"]=props.prefillValues["_id"];
    data["L"]=props.prefillValues["L"];
    const sections = ["TD","CD","C","CP","CS","PD"];
    for (let i=0; i<sections.length; i++){
      const section = sections[i];
      const obj = props.prefillValues[section];
      if (obj){
        data[`${section}M`] = obj["M"];
        data[`${section}C`] = obj["C"];
      }
    }
    setTeamMembers(data);
  }
  
  useEffect(()=>{
    if (props.edit)
      getTeamData();
    else
      getLeaderSuggestions();
  },[]);

  useEffect(()=>{
    if (props.edit && Object.keys(props.prefillValues).length!=0)
      teamMembersCombinedToSeparate();

    if (props.prefillValues && props.prefillValues["L"] && props.prefillValues["L"]!="" && props.prefillValues["L"].length!=0){
      //console.log("TEAM LEADER",props.prefillValues["L"])
      getMemberSuggestions();}
    //console.log("new prefillvalues",props.prefillValues)
  },[props.prefillValues]);

  return <FormFieldsRender form={props.form} formType="team" errorList={props.errorList}
    prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
    edit={props.edit} 
    filteredSuggestions={memberSuggestions} leaderSuggestions={leaderSuggestions} teamMembers={teamMembers} 
  />

  /* return (
    props.form.map((field,index)=>{
      if (field.category=="label"){
        return <div key={"label"}>
        <div key={index} className={field.sectionClassName}>{field.name}</div>
        </div> 
      }
      else if (field.category=="grid"){
        return(
          <div key={index+"grid"}>
            <div key={index+"grid name"} className={field.sectionClassName||""}>{field.sectionName}</div>
            <div key={index+"gridz"} className={`grid grid-cols-${field.row}`}>
              {field.fields.map((item, itemIndex)=>{
                if (item.type=="combobox"){
                  const immutable = item.immutable==undefined?false:(props.edit &&item.immutable)
                  const disabled = item.disabled==undefined?false:item.disabled;
                  return <span key={index+"_"+itemIndex} className="mr-3">
                    <ComboboxField key={index} index={index} fieldData={item} disabled={disabled||immutable} 
                      prefillValue={teamMembers[item.id]} setPrefillValues={props.setPrefillValues} suggestions={item.id=="L"?leaderSuggestions:memberSuggestions}
                    />
                  </span>
                }
                else
                  return <span key={index+"_"+itemIndex} className="mr-3">
                    <TextField key={index} index={index}  size="large" fieldData={item}
                      disabled={(item["disabled"]||false)||((item["immutable"]||false)&&props.edit)} 
                      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
                    />
                  </span>
              })}
            </div>
          </div> 
        )
      }
    })
  ) */
}

export default FormDialogTeam;