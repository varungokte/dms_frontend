import { FormEvent, useContext, useEffect, useState } from "react";
import moment from "moment";
import { FieldValues,} from "@/types/DataTypes";
import { GridFieldAttributes } from "@/types/FormAttributes";
import { LoanCommonProps } from "@/types/ComponentProps";
import { constants, statusValues } from "@/Constants";
import { MasterValuesContext } from "@/Contexts";
import { createLoan } from "@/apiFunctions/loanAPIs";

import {FormSectionNavigation} from "../FormComponents/FormSectionNavigation";
import RequiredFieldsNote from "../BasicMessages/RequiredFieldsNote";

import SelectField from "../FormFieldComponents/SelectField";
import DateField from "../FormFieldComponents/DateField";
import TextField from "../FormFieldComponents/TextField";
import IntegerField from "../FormFieldComponents/IntegerField";

function LoanBasicDetails(props:LoanCommonProps) {
  const [fieldValues, setFieldValues] = useState<FieldValues>({});

  const masters = useContext(MasterValuesContext);

  if (!masters)
    return;

  const { DSRAFormList, IndustryList, LoanProductList, LoanTypeList, ProjectStatusList, ZoneList } = masters;

  const {LoanStatusList} = statusValues;
  const {YesOrNoList, LoanSecuredList} = constants;
  
  const fieldList:GridFieldAttributes = {category:"grid",row:4, fields:[
    { id:"CN", name:"Company Name", type:"text", required: true },
    { id:"GN", name:"Group Name", type:"text", required: false },
    { id:"I", name:"Industry", type:"select", options:IndustryList, required: true },
    { id:"Z", name:"Zone", type:"select", options:ZoneList, required: true },
    { id:"P", name:"Loan Product", type:"select", options:LoanProductList, required: true },
    { id:"T", name:"Loan Type", type:"select", options:LoanTypeList, required: true },
    { id:"ST", name:"Secured", type:"select", options:LoanSecuredList, required: true }, 
    { id:"PS", name:"Project Status", type:"select", options:ProjectStatusList, required: true },
    { id:"S", name:"Loan Status", type:"select", options:LoanStatusList, required:true},
    { id:"PN", name:"PAN Number", type:"text", required: false },
    { id:"GST", name:"GST Number", type:"text", required: false },
    { id:"CIN", name:"CIN Number", type:"text", required: false },
    { id:"SD", name:"Sanction Date", type:"date", required: true },
    { id:"DD", name:"Downsell Date", type:"date", required: false },
    { id:"CD", name:"Loan Closure Date", type:"date", required: false },
    { id:"RED", name:"Repayment End Date", type:"date", required: false },
    { id:"SA", name:"Sanction Amount", type:"integer",required: true },
    { id:"HA", name:"Hold Amount", type:"integer", required: true },
    { id:"DA", name:"Downsell Amount", type:"integer", required: false },
    { id:"OA", name:"Outstanding Amount", type:"integer", required: false },
    { id:"A", name:"DSRA Applicability", type:"select", options:YesOrNoList, required: false },
    { id:"F", name:"DSRA Form", type:"select", options:DSRAFormList, required: false },
    { id:"DS", name:"DSRA Created or Not", type:"select", options:YesOrNoList, required: false },
    { id:"V", name:"DSRA Amount", type:"integer", required: false },
    ]};

  const [validationErrors, setValidationErrors] = useState<{[key:string]:string}>({});
  const [requiredErrors, setRequiredErrors] = useState<string[]>();
  const [enableLoadingSign,setEnableLoadingSign] = useState(false); 

  const dsraFields = ["A","F","DS","V"]; 

  useEffect(()=>{
    if (Object.keys(props.preexistingValues).length!=0){
      //console.log("preexising values",props.preexistingValues)
      const obj:FieldValues={};
      Object.keys(props.preexistingValues).map(value=>{
        if (value=="SD" || value=="DD" || value=="CD" || value=="RED")
          obj[value] = moment(props.preexistingValues[value]).format("yyyy-MM-DD");
        else
          obj[value]= props.preexistingValues[value];
      });
      const num = (Number(props.preexistingValues["SA"]) - Number(props.preexistingValues["HA"])||0)||0;
      obj["DA"] = num;
      if (props.preexistingValues["DSRA"] && Object.keys(props.preexistingValues["DSRA"]).length!=0){
        for (let i=0; i<Object.keys(props.preexistingValues["DSRA"]).length; i++){
          const key = Object.keys(props.preexistingValues["DSRA"])[i];
          obj[key=="S"?"DS":key] = props.preexistingValues["DSRA"][key];
        }
      }
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
    //console.log("Field values",fieldValues)
    if (Object.keys(props.preexistingValues).length!=0){
      //console.log("no changes?",compareFieldsToPreexisting())
      props.setUnsavedWarning(!compareFieldsToPreexisting());
    }
  },[fieldValues,props.preexistingValues]);

  useEffect(()=>{
    if (fieldValues["A"] && fieldValues["A"]==YesOrNoList[2]){
      setFieldValues(curr=>{
        curr["F"] = "";
        curr["DS"] = "";
        curr["V"] = "";
        return {...curr};
      });
    }
  },[fieldValues["A"]])

  const compareFieldsToPreexisting = () => {
    let no_changes = true;
    for (let i=0; i<fieldList["fields"].length; i++){
      const id = fieldList["fields"][i].id;
      if (id=="break"||id=="DA")
        continue;
      let isDateField = false;
      fieldList["fields"].map(obj=>{if (obj.id==id && obj.type=="date") isDateField=true;})

      const isDsraField = dsraFields.includes(id);

      const dsraFieldError = isDsraField && (fieldValues[id] && props.preexistingValues["DSRA"] && props.preexistingValues["DSRA"][id] && fieldValues[id]!= props.preexistingValues["DSRA"][id=="DS"?"S":id]);
      const dateFieldError = isDateField && (fieldValues[id] && props.preexistingValues[id] && fieldValues[id]!=moment(props.preexistingValues[id]).format("yyyy-MM-DD"));
      const regFieldError = !isDsraField && !isDateField && (fieldValues[id] && props.preexistingValues[id]!=fieldValues[id]);

      if (dsraFieldError || dateFieldError || regFieldError)
        no_changes = false;
    }
    return no_changes;
  }

  const validateRequiredFields = () => {
    const arr = [];
    for (let i=0; i<fieldList.fields.length; i++){
      const field = fieldList.fields[i];
      if (field.required && !fieldValues[field.id])
        arr.push(field.id);
    }
    return arr;
  }

  const submitForm = async (e:FormEvent) => {
    e.preventDefault();
    const data:FieldValues={};
    const dsra:FieldValues={};

    const requiredFieldsFilled = validateRequiredFields();

    if (requiredFieldsFilled.length!=0){
      setRequiredErrors(requiredFieldsFilled);
      return;
    }

    Object.keys(fieldValues).map(field=>{
      if (field=="A" && fieldValues[field]==YesOrNoList[2])
        dsra[field] = fieldValues[field]
      else if (field=="A" || field=="F" || field=="DS" || field=="V"){
        if (fieldValues[field] && fieldValues[field]!=props.preexistingValues[field])
          dsra[field=="DS"?"S":field] = fieldValues[field];
      }
      else{
        if (field=="DA")
          return;
        let isDateField = false;
        fieldList["fields"].map(obj=>{if (obj.id==field && obj.type=="date") isDateField=true;})
        if (fieldValues[field]==null || fieldValues[field]=="" || (Object.keys(props.preexistingValues).length!=0 && (fieldValues[field]==props.preexistingValues[field] || (isDateField && fieldValues[field]==moment(props.preexistingValues[field]).format("yyyy-MM-DD")))))
          return;
        data[field] = fieldValues[field];
      }
    })

    if (dsra && Object.keys(dsra).length!=0)
      data["DSRA"] = dsra;

    const error_list:{[key:string]:string} ={};
    if (data["GST"] && data["GST"].length!=15)
      error_list["GST"]="GST number must be 15 digits";
    if (data["PN"] && data["PN"].length!=10)
      error_list["PN"]="PAN must be 10 digits";
    if (data["CIN"] && data["CIN"].length!=21)
      error_list["CIN"]="CIN must be 21 digits";
    
    const HA=data["HA"]?data["HA"]:props.preexistingValues["HA"];
    const SA=data["SA"]?data["SA"]:props.preexistingValues["SA"];
    if (HA && SA && Number(HA)>Number(SA))
      error_list["SA"]="This cannot be less than the Hold Amount";

    if (Object.keys(error_list).length>0){
      setValidationErrors(error_list);
      return;
    }

    if (Object.keys(data).length!=0){
      data["AID"]= props.AID;
      data["_loanId"]= props.loanId;

      if (fieldValues["ST"]==LoanSecuredList[2])
        props.setShowSecurityDetails(false);
      else if (fieldValues["ST"]==LoanSecuredList[1])
        props.setShowSecurityDetails(true);

      setEnableLoadingSign(true);

      console.log("Submitting",data);
      
      const res = await createLoan(data);
      if (res==200){
        setFieldValues(data);
        props.goToNextSection({okToFrolic:true, changesHaveBeenMade:true});
      }
    }
    else{
      if (fieldValues["ST"]==LoanSecuredList[2])
        props.setShowSecurityDetails(false);
        props.goToNextSection();
    }
  }

  return(
    <div className="">
      <br/>
      <RequiredFieldsNote />
      <br/>
      <form onSubmit={submitForm} noValidate>
        <div className="grid grid-cols-4">
          {fieldList["fields"].map((field,index)=>{
            let errorMessage="";
            if (field.id in validationErrors)
              errorMessage=validationErrors[field.id]
            let disabled = false;
            if (field.id=="break")
              return<div key={index}></div>
            else if ((!fieldValues["A"] || fieldValues["A"]=="" || fieldValues["A"]==YesOrNoList[2]) && (field.id=="F" || field.id=="DS" || field.id=="V"))
              disabled=true;
            else if (field.id=="DA")    
              disabled=true;
            
            const validateDA = (field.id=="HA"|| field.id=="SA")?{HA:fieldValues["HA"], SA:fieldValues["SA"]}:undefined;
            
            if (field.type=="select")
              return <SelectField key={field.id} index={field.id} fieldData={field} fieldValue={fieldValues[field.id]} setFieldValues={setFieldValues} disabled={props.actionType=="VIEW"||disabled} readonly={props.actionType=="VIEW"} error={requiredErrors?.includes(field.id)} />
            else if (field.type=="integer")
              return <IntegerField key={field.id} index={field.id} fieldData={field} fieldValue={fieldValues[field.id]} setFieldValues={setFieldValues} disabled={props.actionType=="VIEW"||disabled} readonly={props.actionType=="VIEW"} error={requiredErrors?.includes(field.id)} validateDA={validateDA} />
            else if (field.type=="date")
              return <DateField key={field.id} index={field.id} fieldData={field} fieldValue={fieldValues[field.id]} setFieldValues={setFieldValues} disabled={props.actionType=="VIEW"||disabled} readonly={props.actionType=="VIEW"} error={requiredErrors?.includes(field.id)} />
            else
              return <TextField key={field.id} index={field.id} fieldData={field} fieldValue={fieldValues[field.id]} setFieldValues={setFieldValues} size="medium" disabled={props.actionType=="VIEW"||disabled} errorMessage={errorMessage} readonly={props.actionType=="VIEW"} error={requiredErrors?.includes(field.id)} />
          })}
        </div>
        <br/>
        {requiredErrors && requiredErrors.length>0?<p className="text-red-600 mx-3">Please fill all required fields</p>:<></>}
        <br />
        <FormSectionNavigation currentSection={props.currentSection} sectionCount={props.sectionCount} goToPreviousSection={props.goToPreviousSection} goToNextSection={props.goToNextSection} isForm enableLoadingSign={enableLoadingSign} actionType={props.actionType} />
      </form>
      <br/>
    </div>
  )
}

export default LoanBasicDetails;