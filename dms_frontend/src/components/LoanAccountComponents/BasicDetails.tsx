import { FormEvent, useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import { TextField, SelectField, NumberField, DateField, ComboboxField } from "../FormComponents/FormFields";
import { EnumIteratorValues, ZoneList } from "../BasicComponents/Constants";
import {FormSectionNavigation} from "../FormComponents/FormSectionNavigation";
import moment from "moment";
import RequiredFieldsNote from "../BasicComponents/RequiredFieldsNote";
import { useToast } from "@/components/ui/use-toast"
import { FieldDataTypes, FieldValues } from "DataTypes";

function BasicDetails(props:{key:number,actionType: string, loanId: string, setLoanId: Function, AID: string, setAID: Function, currentSection: number, setCurrentSection: Function, goToNextSection: Function, setUnsavedWarning: Function, label: string, setShowSecurityDetails: Function, showSecurityDetails: boolean, setOkToFrolic: Function, preexistingValues:FieldValues}) {
  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  
  const [fieldList] = useState<{id:string, name:string, type:FieldDataTypes, required:boolean, options?:string[]}[]>([
    { id:"CN", name:"Company Name", type:"text", required: true },
    { id:"GN", name:"Group Name", type:"text", required: false },
    { id:"I", name:"Industry", type:"select", options:["Banking","Real Estate", "Manufacturing"], required: true },
    { id:"Z", name:"Zone", type:"select", options:EnumIteratorValues(ZoneList), required: true },
    { id:"P", name:"Loan Product", type:"select", options:["Term Loan","Drop-line LOC", "WCDL", "Debentures"], required: false },
    { id:"T", name:"Loan Type", type:"select", options:["Long Term","Short Term"], required: true },
    { id:"ST", name:"Secured", type:"select", options:["Secured","Unsecured"], required: true }, 
    { id:"PS", name:"Project Status", type:"select", options:["Not Started","In Progress","Finished"], required: true },
    { id:"PN", name:"PAN Number", type:"text", required: false },
    { id:"GST", name:"GST Number", type:"text", required: false },
    { id:"CIN", name:"CIN Number", type:"text", required: false },
    { id:"break", name:"break", type:"text", required:false },
    { id:"SD", name:"Sanction Date", type:"date", required: true },
    { id:"DD", name:"Downsell Date", type:"date", required: false },
    { id:"CD", name:"Loan Closure Date", type:"date", required: false },
    { id:"RED", name:"Repayment End Date", type:"date", required: false },
    { id:"SA", name:"Sanction Amount", type:"number", required: true },
    { id:"HA", name:"Hold Amount", type:"number", required: false },
    { id:"DA", name:"Downsell Amount", type:"number", required: false },
    { id:"OA", name:"Outstanding Amount", type:"number", required: false },
    { id:"A", name:"DSRA Applicability", type:"select", options:["Yes","No"], required: false },
    { id:"F", name:"DSRA Form", type:"select", options:["LC","BG", "FD"], required: false },
    { id:"S", name:"DSRA Created or Not", type:"select", options:["Yes","No"], required: false },
    { id:"V", name:"DSRA Amount", type:"number", required: false },
  ]);

  const [validationErrors, setValidationErrors] = useState<{[key:string]:string}>({});

  useEffect(()=>{
    if (Object.keys(props.preexistingValues).length!=0){
      const obj:FieldValues={};
      Object.keys(props.preexistingValues).map(value=>{
        if (value=="SD" || value=="DD" || value=="CD" || value=="RED")
          obj[value] = moment(props.preexistingValues[value]).format("yyyy-MM-DD");
        else
          obj[value]= props.preexistingValues[value];
      });
      const num = (Number(props.preexistingValues["SA"]) - Number(props.preexistingValues["HA"])||0)||0;
      obj["DA"] = num;
          
      setFieldValues((curr)=>{
        return {...curr, ...obj}
      });

      props.setUnsavedWarning(false);
      props.setOkToFrolic(true);
    }
    else
      props.setOkToFrolic(false);
  },[props.preexistingValues]);

  useEffect(()=>{
    if (Object.keys(props.preexistingValues).length!=0)
      props.setUnsavedWarning(!compareFieldsToPreexisting());
  },[fieldValues])

  const {createLoan} = useGlobalContext();  
  const { toast } = useToast()

  const compareFieldsToPreexisting = () => {
    let no_changes = true;
    for (let i=0; i<fieldList.length; i++){
      const id = fieldList[i].id;
      if (id=="break")
        break;
      if (fieldValues[id] && props.preexistingValues[id]!=fieldValues[id])
        no_changes= false;
    }
    return no_changes;
  }

  const submitForm = (e:FormEvent) => {
    e.preventDefault();
    
    const data:FieldValues={};
    const dsra:FieldValues={};

    Object.keys(fieldValues).map(field=>{
      if (field=="A" && fieldValues[field]==2)
        dsra[field] = fieldValues[field]
      else if (field=="A" || field=="F" || field=="S" || field=="V"){
        if (fieldValues[field]!=null && fieldValues[field]==props.preexistingValues[field])
          dsra[field] = fieldValues[field];
      }
      if (fieldValues[field]==null || fieldValues[field]==-1 || (props.actionType=="EDIT" && Object.keys(props.preexistingValues).length!=0 && fieldValues[field]==props.preexistingValues[field]))
        return;
      data[field] = fieldValues[field];
    })

    if (dsra && Object.keys(dsra).length!=0)
      data["dsra"] = dsra;

    const error_list:{[key:string]:string} ={};
    if (data["GST"] && data["GST"].length!=15)
      error_list["GST"]="GST number must be 15 digits";
    if (data["PN"] && data["PN"].length!=10)
      error_list["PN"]="PAN must be 10 digits";
    if (data["CIN"] && data["CIN"].length!=21)
      error_list["CIN"]="CIN must be 21 digits";
    
    const HA=data["HA"]?data["HA"]:props.preexistingValues["HA"];
    const SA=data["SA"]?data["SA"]:props.preexistingValues["SA"];
    if (HA && SA && HA>SA)
      error_list["SA"]="This cannot be less than the Hold Amount";

    if (Object.keys(error_list).length>0){
      setValidationErrors(error_list);
      return;
    }

    if (Object.keys(data).length!=0){
      console.log("SUBMITTED NOW",data);

      data["AID"]= props.AID;
      data["_loanId"]= props.loanId;

      if (fieldValues["ST"]==2)
        props.setShowSecurityDetails(false);
      else if (fieldValues["ST"]==1)
        props.setShowSecurityDetails(true);

      createLoan(data).then(res=> {
        if (res==200){
          setFieldValues(data);
          props.goToNextSection();
          props.setOkToFrolic(true)
        }
        else
          toast({
            title: "Error!",
            description: "Something went wrong",
            className:"bg-white"
          })
      }   
      ).catch(err=> console.log(err))
    }
    else{
      if (fieldValues["ST"]==2)
        props.setShowSecurityDetails(false);
        props.goToNextSection();
    }
  }

  return(
    <div className="">
      <br/>
      <RequiredFieldsNote />
      <br/>
      <form onSubmit={submitForm}>
        <div className="grid grid-cols-4">
          {fieldList.map((field,index)=>{
            let errorMessage="";
            if (field.id in validationErrors)
              errorMessage=validationErrors[field.id]
            let disabled = false;
            if (field.id=="break")
              return<div key={index}></div>
            else if ((!fieldValues["A"] || fieldValues["A"]==-1 || fieldValues["A"]==2) && (field.id=="F" || field.id=="S" || field.id=="V"))
              disabled=true;
            else if (field.id=="DA")            
              disabled=true;
            
            if (field.type=="select")
              return <SelectField key={field.id} index={field.id} id={field.id} name={field.name} setPrefillValues={setFieldValues} prefillValues={fieldValues} options={field.options||[]} required={field.required} disabled={disabled} />
            else if (field.type=="number")
              return <NumberField key={field.id} index={field.id} id={field.id} name={field.name||""} setPrefillValues={setFieldValues} prefillValues={fieldValues} required={field.required||false} disabled={disabled} />
            else if (field.type=="combobox")
              return <ComboboxField key={field.id} index={field.id} id={field.id} name={field.name||""} setPrefillValues={setFieldValues} prefillValues={fieldValues} required={field.required||false} disabled={disabled} suggestions={field.options} />
            else if (field.type=="date")
              return <DateField key={field.id} index={field.id} id={field.id} name={field.name||""} setPrefillValues={setFieldValues} prefillValues={fieldValues} required={field.required||false} disabled={disabled} />
            else
              return <TextField key={field.id} index={field.id} id={field.id} name={field.name||""} setPrefillValues={setFieldValues} prefillValues={fieldValues} type={field.type||""} required={field.required||false} disabled={disabled} errorMessage={errorMessage} />
          })}
        </div>
        <br/>
        <FormSectionNavigation currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} isForm={true} />
      </form>
      <br/>
    </div>
  )
}


export default BasicDetails;