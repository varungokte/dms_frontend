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
import PermissionsField from "../FormFieldComponents/PermissionsField";
import RoleField from "../FormFieldComponents/RoleField";
import SelectField from "../FormFieldComponents/SelectField";
import TextAreaField from "../FormFieldComponents/TextAreaField";
import TextField from "../FormFieldComponents/TextField";
import { CircularProgress } from "@mui/material";
import NumberDecimalField from "../FormFieldComponents/FloatNumberField";
import IntegerField from "../FormFieldComponents/IntegerField";

type FormDialogProps = {
  index:number, type:FormDialogTypes, edit?:boolean, 
  triggerText:string|ReactElement, triggerClassName?:string, 
  formSize:"small"|"medium"|"large", formTitle:string, submitButton:string, formSubmit:Function, 
  form:FieldAttributesList, 
  currentFields:FieldValues, repeatFields?:boolean, 
  suggestions?:UserSuggestionTypes, getRoles?:boolean 
}

enum FormSizes {
  small= "min-w-[600px] min-h-[300px]",
  medium= "min-w-[800px] min-h-[300px]",
  large= "min-w-[1000px] min-h-[300px]",
};  

function FormDialog(props:FormDialogProps){
  const [open, setOpen] = useState(false);
  const [prefillValues, setPrefillValues] = useState<FieldValues>({});
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [submitButtonText, setSubmitButtonText] = useState(<span>{props.submitButton}</span>);

  useEffect(()=>{
    if (!open)
      setPrefillValues({});
  },[open]);

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
      data = {...prefillValues};

      if (key=="P" && props.edit)
        continue;
      
      //console.log("RECENTLY ASSIGEND DATA",data);
      if (value && (!(Object.keys(data).includes(key)) || data[key]=="" || data[key]==-1)){
        setErrorMessage(<p className="text-red-600">Please fill all required fields.</p>);
        return false;
      }
    }

    setErrorMessage(<></>);
    return true;
  }

  const submitFunction = async () => {
    const okToSubmit = validateRequiredFields();
    if(okToSubmit){
      //console.log("prefillValues",prefillValues)
      setSubmitButtonText(<CircularProgress className="mt-1" sx={{color:"white"}} />);
      const res = await props.formSubmit({...prefillValues},props.index);
      setSubmitButtonText(<span>{props.submitButton}</span>)
      if (res==200)
        setOpen(false);
      else if (res==422)
        setErrorMessage(<p className="text-red-600">Already exists.</p>);
      else {
        setErrorMessage(<p className="text-yellow-600">Something went wrong.</p>);
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
            <RenderForm key={"f0"} edit={props.edit||false} formType={props.type} currentFields={props.currentFields} form={props.form} prefillValues={{...prefillValues}} setPrefillValues={setPrefillValues} suggestions={props.suggestions} getRoles={props.getRoles} formSubmit={props.formSubmit} />
            {errorMessage}
            <br/>
            <div className="flex flex-row">
              <div className="flex-auto"></div>
              <DialogClose className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle">Cancel</DialogClose>
              <button className={`float-right ${SubmitButtonStyling}`} type="button" onClick={()=>submitFunction()} >
                {submitButtonText}
              </button>
            </div>
        </DialogContent>
        :<></>
      }
    </Dialog>
  )
}

function RenderForm(props:{ edit:boolean, formType:FormDialogTypes, currentFields:FieldValues, form:FieldAttributesList, prefillValues:FieldValues, setPrefillValues:Function, suggestions?:UserSuggestionTypes, getRoles?:boolean, formSubmit?:Function}){
  const [roles, setRoles] = useState<FieldValues[]>();

  const [allSuggestions, setAllSuggestions] = useState<UserSuggestionsList>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<UserSuggestionsList>([]);
  const [oldZone, setOldZone] = useState("");

  const {getUserSuggestions, getSingleUser, getRolesList} = useGlobalContext();

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

  const listSuggestions = async (suggestionType?:UserSuggestionTypes) => {
    const res = await getUserSuggestions(suggestionType?suggestionType:props.suggestions||"RM");
    console.log("sugg",props.suggestions, res.obj)
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

  useEffect(()=>console.log("filtered suggestions",filteredSuggestions),[filteredSuggestions])

  const getUserData = async () => {
    const res = await getSingleUser(props.currentFields["_id"]);
    if (res.status==200){
      console.log("single user data",res.obj)
      props.setPrefillValues({...res.obj});
      setOldZone("");
    }
    else
      props.setPrefillValues({});
  }

  useEffect(()=>{
    if (props.edit&& props.formType=="user"){
        getUserData();
    }

    if (props.getRoles)
      listRoles();

    if (props.suggestions)
      listSuggestions();
  },[]);

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
    props.setPrefillValues({...props.currentFields});
  },[props.currentFields]);

  return (
    props.form.map((field,index)=>{
      if (field["category"]=="label"){
        return <div key={index} className={field["sectionClassName"]}>{field["name"]}</div>
      }
      else if (field["category"]=="single"){
        if (field["type"]=="combobox")
          return <ComboboxField key={index} index={index} id={field["id"]} name={field["name"]} edit={props.edit}
            required={field["required"]} disabled={field["disabled"]||(field["immutable"]&&props.edit)} 
            prefillValue={props.prefillValues[field["id"]]} setPrefillValues={props.setPrefillValues} multiple={field["multiple"]} suggestions={filteredSuggestions}
          />
        else if (field["type"]=="role")
          return <RoleField key={index} index={index} id={field["id"]} name={field["name"]} roleList={roles||[]}
            required={field["required"]} disabled={field["disabled"]||(field["immutable"]&&props.edit)} 
            prefillValues={{...props.prefillValues}} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="permissions")
          return <PermissionsField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]||(field["immutable"]&&props.edit)} 
            setPermissionSet={props.setPrefillValues} permissionPreset={props.prefillValues[field["id"]]||{}}
          />
        else if (field["type"]=="textarea")
          return <TextAreaField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]||(field["immutable"]&&props.edit)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues}
          />
        else if (field["type"]=="date")
          return <DateField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]||(field["immutable"]&&props.edit)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues}
          />
        else if (field["type"]=="integer")
          return <IntegerField key={index} index={index} id={field["id"]} name={field["name"]}
            required={field["required"]} disabled={field["disabled"]||(field["immutable"]&&props.edit)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="float")
          return <NumberDecimalField key={index} index={index} id={field["id"]} name={field["name"]}
            required={field["required"]} disabled={field["disabled"]||(field["immutable"]&&props.edit)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="multitext")
          return <MultiTextField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]||(field["immutable"]&&props.edit)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="checkbox")
          return <CheckboxField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]||(field["immutable"]&&props.edit)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="select") 
          return <SelectField key={index} index={index} id={field["id"]} name={field["name"]} options={field["options"]||[]}
            required={field["required"]} disabled={field["disabled"]||(field["immutable"]&&props.edit)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues}
          />
        else
          return <TextField key={index} index={index} id={field["id"]} name={field["name"]} type={field["type"]}
            required={field["required"]} disabled={field["disabled"]||(field["immutable"]&&props.edit)} 
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
              {field.fields.map((item, itemIndex)=>{
                if (item["type"]=="combobox")
                  return <span key={index+"_"+itemIndex} className="mr-3">
                    <ComboboxField key={index} index={index} id={item["id"]} name={item["name"]} edit={props.edit}
                      required={item["required"]} disabled={item["disabled"]||(item["immutable"]&&props.edit)} 
                      prefillValue={props.prefillValues[item["id"]]} setPrefillValues={props.setPrefillValues} multiple={item["multiple"]} suggestions={filteredSuggestions}
                    />
                  </span> 
                else if (item["type"]=="select")
                  return <span key={index+"_"+itemIndex} className="mr-3">
                    <SelectField key={index} index={index} id={item["id"]} name={item["name"]} options={item["options"]||[]}
                      required={item["required"]} disabled={item["disabled"]||(item["immutable"]&&props.edit)} 
                      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
                      setOldZone={item["id"]=="Z"?setOldZone:undefined}
                    />
                  </span>
                else
                  return <span key={index+"_"+itemIndex} className="mr-3">
                    <TextField key={index} index={index} id={item["id"]} name={item["name"]} type={item["type"]}
                      required={item["required"]} disabled={item["disabled"]||(item["immutable"]&&props.edit)} 
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