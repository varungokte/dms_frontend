import { ReactElement, useEffect, useState } from "react";
import useGlobalContext from "../../../GlobalContext";
import { FieldAttributesList, FieldValues, FormDialogTypes, UserSuggestionTypes, UserSuggestionsList } from "DataTypes";

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RequiredFieldsNote from "../BasicComponents/RequiredFieldsNote";
import { SubmitButtonStyling } from "../BasicComponents/PurpleButtonStyling";

import CheckboxField from "../FormFieldComponents/CheckboxField";
import ComboboxField from "../FormFieldComponents/ComboboxField";
import DateField from "../FormFieldComponents/DateField";
import MultiTextField from "../FormFieldComponents/MultiTextField";
import NumberField from "../FormFieldComponents/NumberField";
import PermissionsField from "../FormFieldComponents/PermissionsField";
import RoleField from "../FormFieldComponents/RoleField";
import SelectField from "../FormFieldComponents/SelectField";
import TextAreaField from "../FormFieldComponents/TextAreaField";
import TextField from "../FormFieldComponents/TextField";

type FormDialogProps = {
  index:number, 
  type:FormDialogTypes, 
  edit?:boolean, 
  triggerText:string|ReactElement, 
  triggerClassName?:string, 
  formSize:"small"|"medium"|"large", 
  formTitle:string, 
  formSubmit:Function, 
  submitButton:string, 
  form:FieldAttributesList, 
  currentFields:FieldValues, 
  repeatFields?:boolean, 
  suggestions?:UserSuggestionTypes, 
  getRoles?:boolean 
}

function FormDialog(props:FormDialogProps){
  const [open, setOpen] = useState(false);
  const [prefillValues, setPrefillValues] = useState<FieldValues>({});
  const [errorMessage, setErrorMessage] = useState(<></>);

  enum FormSizes {
    small= "min-w-[600px] min-h-[300px]",
    medium= "min-w-[800px] min-h-[300px]",
    large= "min-w-[1000px] min-h-[300px]",
  };  

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
    for (let i=0;i<Object.keys(requiredList).length;i++){
      let key = Object.keys(requiredList)[i];
      let value = requiredList[key];
      if (key=="perm"){
        key="R";
        value=true;
      }
      data = (props.type=="team" && props.edit)?teamMembersRenamingWhileSubmitting():{...prefillValues};

      if (key=="P" && props.edit)
        continue;
      
      //console.log("RECENTLY ASSIGEND DATA",data);
      if (value && (!(Object.keys(data).includes(key)) || data[key]=="" || data[key]==-1)){
        console.log("ERROR",key,value,Object.keys(data),data)
        setErrorMessage(<p className="text-red-600">Please fill all required fields.</p>);
        return false;
      }
    }

    setErrorMessage(<></>);
    if (props.type=="team" && props.edit)
      return data;
    return true;
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
      let res;
      if (props.edit && props.type=="user")
        res = await props.formSubmit(submittedData==false?prefillValues:submittedData,props.index);
      else
        res = await props.formSubmit(submittedData==false?prefillValues:submittedData);
      
      if (res==200)
        setOpen(false);
      else if (res==422)
        setErrorMessage(<p className="text-red-600">Already exists.</p>);
      else{
        setErrorMessage(<p className="text-yellow-600">Something went wrong.</p>);
        console.log("PREFILL VALUES",prefillValues)
        prefillValues["UP"] = JSON.parse(prefillValues["UP"])
      }
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen} key={props.index}>
      <DialogTrigger className={props.triggerClassName||""}>{props.triggerText}</DialogTrigger>
      {open
        ?<DialogContent className={`bg-white overflow-y-scroll max-h-screen ${FormSizes[props.formSize]} `}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-normal">{props.formTitle}</DialogTitle>
            <hr/>
          </DialogHeader>
            <RequiredFieldsNote />
            <RenderForm key={"f0"} edit={props.edit||false} formType={props.type} currentFields={props.currentFields} form={props.form} prefillValues={{...prefillValues}} setPrefillValues={setPrefillValues} suggestions={props.suggestions} getRoles={props.getRoles} />
            {errorMessage}
            <br/>
            <div className="flex flex-row">
              <div className="flex-auto"></div>
              <DialogClose className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle">Cancel</DialogClose>
              <button className={`float-right ${SubmitButtonStyling}`} type="button" onClick={()=>submitFunction()} >
                {props.submitButton}
              </button>
            </div>
        </DialogContent>
        :<></>
      }
    </Dialog>
  )
}

function RenderForm(props:{ edit:boolean, formType:FormDialogTypes, currentFields:FieldValues, form:FieldAttributesList, prefillValues:FieldValues, setPrefillValues:Function, suggestions?:UserSuggestionTypes, getRoles?:boolean}){
  const [roles, setRoles] = useState<FieldValues[]>();
  const [suggestionsUnformatted, setSuggestionsUnformatted] = useState<any>();

  const [suggestionsList, setSuggestionsList] = useState<UserSuggestionsList>([]);
  const [zone, setZone] = useState(-1);

  const [teamMembers, setTeamMembers] = useState<FieldValues>({});
  
  const {getUserSuggestions, getSingleUser, getRolesList, getSingleTeam} = useGlobalContext();

  const listRoles = async () => {
    const res = await getRolesList();
    if (res.status==200){
      const arr = await res.data.map((obj:FieldValues)=>{
        const permissionObj = JSON.parse(obj["P"]?.toString()||"");
        obj["P"] = permissionObj;
        return obj;
      });
      setRoles(arr);
    }
    else
    setRoles([]);
  };

  const listSuggestions = async () => {
    const res = await getUserSuggestions(props.suggestions||"AU");
    if (res.status==200)
      setSuggestionsUnformatted(res.obj);
    else
      return [];
  }

  const filterSuggestions = () => {
    if (suggestionsUnformatted==undefined)
      return;

    const arr:any=[];
    let restrictedByZone = false;
    if (props.formType=="user"){
      arr.push({label:"root",values:{E:"root", N:"root"}});
      restrictedByZone=true;
    }

    for (let i=0; i<suggestionsUnformatted.length; i++){
      const obj = suggestionsUnformatted[i];
      if (!restrictedByZone || (restrictedByZone && obj.Z==zone))
        arr.push({label:`${obj.N}<${obj.E}>`, values:obj})
    }
    setSuggestionsList(arr);
  }

  const getUserData = async () => {
    const res = await getSingleUser(props.currentFields["_id"]);
    if (res.status==200){
      props.setPrefillValues(res.obj);
      setZone(res.obj["Z"]||-1);
    }
    else
      props.setPrefillValues([]);
  }

  const getTeamData = async () => {
    const res = await getSingleTeam(props.currentFields["_id"]);
    if (res.status==200){
      res.obj["_id"]=props.currentFields["_id"];
      props.setPrefillValues(res.obj);
    }
    
    else
      props.setPrefillValues([]);
  }

  const teamRolesRenaming = () => {
    const data:any={};
    data["_id"]=props.prefillValues["_id"];
    data["L"]=props.prefillValues["L"];
    const sections = ["TD","CD","C","CP","CS","PD"];
    for (let i=0; i<sections.length; i++){
      const section = sections[i];
      const obj = props.prefillValues[section];
      data[`${section}M`] = obj["M"];
      data[`${section}C`] = obj["C"];
    }
    setTeamMembers(data);
  }

  useEffect(()=>{
    if (props.edit && props.formType=="team" && Object.keys(props.prefillValues).length!=0)
      teamRolesRenaming()
  },[props.prefillValues])
  
  useEffect(()=>{
    if (props.edit){
      if (props.formType=="user")
        getUserData();
      else if (props.formType=="team")
        getTeamData();
    }

    if (props.getRoles)
      listRoles();

    if (props.suggestions)
      listSuggestions();
  },[]);

  useEffect(()=>{
    if (props.suggestions)
      filterSuggestions();
  },[suggestionsUnformatted,zone])

  useEffect(()=>{
    props.setPrefillValues(props.currentFields);
  },[props.currentFields]);

  return (
    props.form.map((field:any,index:number)=>{
      if (field["category"]=="label"){
        return <div key={index} className={field["sectionClassName"]}>{field["name"]}</div>
      }
      else if (field["category"]=="single"){
        if (field["type"]=="combobox")
          return <ComboboxField key={index} index={index} id={field["id"]} name={field["name"]} edit={props.edit}
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValue={props.formType=="user"?props.prefillValues[field["id"]]:teamMembers[field["id"]]} setPrefillValues={props.setPrefillValues} multiple={field["multiple"]} suggestions={suggestionsList}
          />
        else if (field["type"]=="role")
          return <RoleField key={index} index={index} id={field["id"]} name={field["name"]} roleList={roles||[]}
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={{...props.prefillValues}} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="permissions")
          return <PermissionsField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            setPermissionSet={props.setPrefillValues} permissionPreset={props.prefillValues[field["id"]]||{}}
          />
        else if (field["type"]=="textarea")
          return <TextAreaField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues}
          />
        else if (field["type"]=="date")
          return <DateField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues}
          />
        else if (field["type"]=="number")
          return <NumberField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="multitext")
          return <MultiTextField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="checkbox")
          return <CheckboxField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="select") 
          return <SelectField key={index} index={index} id={field["id"]} name={field["name"]} options={field["options"]}
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues}
          />
        else
          return <TextField key={index} index={index} id={field["id"]} name={field["name"]} type={field["type"]}
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues}
          />
      }
      else if (field["category"]=="grid"){
        let gridStyle = "grid grid-cols-"; 
        if (field["customWidth"])
          gridStyle = "flex flex-row"
        else
          gridStyle = gridStyle + field["row"];
        return(
          <div key={index+"grid"}>
            <div key={index+"grid name"} className={field["sectionClassName"]||""}>{field["sectionName"]}</div>
            <div key={index+"gridz"} className={gridStyle}>
              {field.fields.map((item:any, itemIndex:number)=>{
                if (item["type"]=="combobox")
                  return <span key={index+"_"+itemIndex} className="mr-3">
                    <ComboboxField key={index} index={index} id={item["id"]} name={item["name"]} edit={props.edit}
                      required={item["required"]} disabled={item["disabled"]?true:(item["immutable"]?(props.edit&&true):false)} 
                      prefillValue={props.formType=="user"?props.prefillValues[item["id"]]:teamMembers[item["id"]]} setPrefillValues={props.setPrefillValues} multiple={item["multiple"]} suggestions={suggestionsList}
                    />
                  </span> 
                else if (item["type"]=="select")
                  return <span key={index+"_"+itemIndex} className="mr-3">
                    <SelectField key={index} index={index} id={item["id"]} name={item["name"]} options={item["options"]}
                      required={item["required"]} disabled={item["disabled"]?true:(item["immutable"]?(props.edit&&true):false)} 
                      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
                      setZone={item["id"]=="Z"?setZone:undefined}
                    />
                  </span>
                else
                  return <span key={index+"_"+itemIndex} className="mr-3">
                    <TextField key={index} index={index} id={item["id"]} name={item["name"]} type={item["type"]}
                      required={item["required"]} disabled={item["disabled"]?true:(item["immutable"]?(props.edit&&true):false)} 
                      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
                    />
                  </span>
              })}
            </div>
          </div> 
        )
      }
    })
  )
}

export default FormDialog;