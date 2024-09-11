import { useEffect, useState } from "react";
import moment from "moment";
import { FrequencyList, HolidayConventionList, InterestTypeList } from "@/functions/Constants";
import { FieldValues, ToastOptionsAttributes } from "@/types/DataTypes";
import { GridFieldAttributes } from "@/types/FormAttributes";
import { LoanCommonProps } from "@/types/ComponentProps";
import { addPaymentSchedule, getPaymentSchedule } from "@/apiFunctions/paymentAPIs";

import {Dialog,DialogTitle,DialogContent} from '@mui/material';
import { DataTable } from "../BasicTables/Table";

import DateField from "../FormFieldComponents/DateField";
import IntegerField from "../FormFieldComponents/IntegerField";
import RadioGroupField from "../FormFieldComponents/RadioGroupField";
import SelectField from "../FormFieldComponents/SelectField";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import FloatNumberField from "../FormFieldComponents/FloatNumberField";
import Toast from "./../BasicComponents/Toast";

function LoanPaymentSchedule(props:LoanCommonProps){
  const fieldList:GridFieldAttributes = {category:"grid", row:2, fields:[
    {id:"P", name:"Principal", type:"integer", required:true, immutable:true},
    {id:"F", name:"Frequency", type:"select", options:FrequencyList, required:true, immutable:true},
    {id:"SD", name:"Start Date", type:"date", required:true, immutable:true},
    {id:"ED", name:"End Date", type:"date", required:true, immutable:true},
    {id:"H", name:"Holiday Convention", type:"select", options:HolidayConventionList, required:true, immutable:true},
    {id:"T", name:"Interest Type (%)", type:"radio", options:InterestTypeList, required:true, immutable:true},
  ]};

  const [fieldValues,setFieldValues] = useState<FieldValues>({T:InterestTypeList[1]});
  const [schedule, setSchedule] = useState<{D:string,I?:number|string}[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [errorList, setErrorList] = useState<string[]>();
  
  const [editMode, setEditMode] = useState(false);
  const [added, setAdded] = useState(true);

  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();

  useEffect(()=>{
    if (added)
      getPaymentSchedule(props.loanId).then(res=>{
        console.log("response",res);
        setAdded(false);
        if (res.status==200 && res.obj && res.obj[0] && res.obj[0]["data"] && res.obj[0]["data"][0]){
          setFieldValues(res.obj[0]["data"][0]);
          //console.log("values",res.obj[0]["data"][0])
          setEditMode(true);
          if (res.obj[0]["data"][0]["GS"])
            setSchedule(res.obj[0]["data"][0]["GS"]);
        }
      })
  },[added]);
  
  const validateFields = () => {
    const arr = [];
    for (let i=0; i<fieldList.fields.length; i++){
      const field = fieldList.fields[i];
      if (field.required && !fieldValues[field.id])
        arr.push(field.id);
    }

    if (fieldValues["T"]==InterestTypeList[1] && !fieldValues["I"])
      arr.push("I");

    if (arr.length>0){
      setErrorMessage(<p className="text-red-600 mx-3">Please fill all required fields.</p>);
      setErrorList(arr);
      return;
    }
    else
      setErrorMessage(<></>);

    if (fieldValues["T"]==InterestTypeList[1])
      fixedInterestSchedule();
    else if (fieldValues["T"]==InterestTypeList[2])
      manualInterestSchedule();
  }

  const manualInterestSchedule = () =>{
    const arr = generateSchedule();
    setDialogOpen(true);
    setSchedule(arr);
  }

  const fixedInterestSchedule = () => {
    const arr = generateSchedule();
    setSchedule(arr);
    submitSchedule(arr);
  }

  const generateSchedule = () => {
    if (editMode)
      return schedule;
    const arr=[];
    const startDate = Date.parse(fieldValues["SD"]);
    const endDate = Date.parse(fieldValues["ED"]);
    let date = startDate;
    let interval=1;
    if (fieldValues["F"]==FrequencyList[1])
      interval=1
    else if (fieldValues["F"]==FrequencyList[2])
      interval=3;
    else if (fieldValues["F"]==FrequencyList[3])
      interval=6;
    else if (fieldValues["F"]==FrequencyList[4])
      interval=12;

    const applyHolidayConvention = {
      [HolidayConventionList[1]]:-1,
      [HolidayConventionList[2]]:+1,
      [HolidayConventionList[3]]:0
    }
    
    while (date<=endDate){
      const curr_date=new Date(date)
      if (curr_date.getDay()==6)
        curr_date.setDate(curr_date.getDate()+ applyHolidayConvention[fieldValues["H"]]*2);
      else if (curr_date.getDay()==0)
        curr_date.setDate(curr_date.getDate()+ applyHolidayConvention[fieldValues["H"]]*1);
      
      arr.push({D:moment(curr_date).format("yyyy-MM-DD")});
      date = curr_date.setMonth(curr_date.getMonth()+interval);
    }

    return arr;
  }

  const submitSchedule = async (arr:{D:string, I?:number|string}[]) => {
    fieldValues["GS"] = arr;
    fieldValues["_loanId"] = props.loanId;
    fieldValues["P"] = Number(fieldValues["P"]);
    fieldValues["ND"] = arr[0]["D"];
    //console.log("submitted", fieldValues);
    const res = await addPaymentSchedule(fieldValues);
    //console.log("response",res)
    if (res==200){
      setDialogOpen(false); 
      setToastOptions({open:true, type:"success", action:"save", section:"Payment schedule"});
      setAdded(true);
    }
    else
      setToastOptions({open:true, type:"error", action:"save", section:"Payment schedule"});
  }

  return(
    <div>
      <div className="grid grid-cols-2">
        {fieldList.fields.map((field,index)=>{
          if (field.type=="integer")
            return <IntegerField key={index} index={index} fieldData={field} fieldValue={fieldValues[field.id]} setFieldValues={setFieldValues} disabled={props.actionType=="VIEW"||(editMode&&(field.immutable||false))} readonly={props.actionType=="VIEW"||(editMode&&(field.immutable||false))} error={errorList?.includes(field.id)} />
          else if (field.type=="date")
            return <DateField key={index} index={index} fieldData={field} fieldValue={fieldValues[field.id]} setFieldValues={setFieldValues} disabled={props.actionType=="VIEW"||(editMode&&(field.immutable||false))} error={errorList?.includes(field.id)} readonly={props.actionType=="VIEW"||(editMode&&(field.immutable||false))} />
          else if (field.type=="select")
            return <SelectField key={index} index={index} fieldData={field} fieldValue={fieldValues[field.id]} setFieldValues={setFieldValues} disabled={props.actionType=="VIEW"||(editMode&&(field.immutable||false))} error={errorList?.includes(field.id)} readonly={props.actionType=="VIEW"||(editMode&&(field.immutable||false))} />
          else if (field.type=="radio")
            return <RadioGroupField key={index} index={index} fieldData={field} fieldValue={fieldValues[field.id]} setFieldValues={setFieldValues} disabled={props.actionType=="VIEW"||(editMode&&(field.immutable||false))} />
        })}
        {fieldValues["T"]!=InterestTypeList[2]
          ?<FloatNumberField key={5} index={5} fieldData={{id:"I", name:"Interest Rate (%)", type:"float", required:true}} fieldValue={fieldValues["I"]} setFieldValues={setFieldValues} disabled={props.actionType=="VIEW"||editMode}  error={errorList?.includes("I")} readonly={props.actionType=="VIEW"||(editMode)} />
          :<></>
        }
        <div className="my-10">
          {props.actionType=="VIEW" || (fieldValues["T"]==InterestTypeList[1] && editMode)
            ?<></>
            :<button className={`${fieldValues["T"]!=InterestTypeList[2]?"float-right":"float-left"} h-[45px] w-[180px] rounded-xl text-white text-lg bg-custom-1 mx-2`} onClick={validateFields}>
              {fieldValues["T"]!=InterestTypeList[2]?"Generate Schedule":`${editMode?"Edit":"Enter"} Interest Rates`} 
            </button>
          }
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)} maxWidth="md" fullWidth>
        {dialogOpen
          ?<>
            <DialogTitle>Enter Interest Rates</DialogTitle>
            <DialogContent>
              <DataTable 
                headingRows={["Installment Number","Installment Date", "Installment Interest Rate(%)"]} headingClassNames={["w-[30%]","w-[30%]","mx-7"]}
                tableData={schedule} columnIDs={["D","I"]} dataTypes={["index","date","text-field"]} cellClassName={["","",""]}
                setValues={setSchedule} 
              />
              <button className="float-right my-9 h-[50px] w-[150px] rounded-xl text-white text-md bg-custom-1" onClick={()=>submitSchedule(schedule)}>Generate Schedule</button>
            </DialogContent>
          </>
          :<></>
        }
      </Dialog>
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}  
      {errorMessage}
      <br />
      <FormSectionNavigation currentSection={props.currentSection} sectionCount={props.sectionCount} goToPreviousSection={props.goToPreviousSection} goToNextSection={props.goToNextSection} isForm={false} />
    </div>
  )
}

export default LoanPaymentSchedule;