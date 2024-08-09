import { useEffect, useState } from "react";
import moment from "moment";
import { FrequencyList, HolidayConventionList, InterestTypeList } from "./../../../Constants";
import { FieldValues, GridFieldAttributes, LoanCommonProps } from "./../../../DataTypes";
import useGlobalContext from "./../../../GlobalContext";

import {Dialog,DialogTitle,DialogContent} from '@mui/material';
import { DataTable } from "../BasicComponents/Table";

import DateField from "../FormFieldComponents/DateField";
import IntegerField from "../FormFieldComponents/IntegerField";
import RadioGroupField from "../FormFieldComponents/RadioGroupField";
import SelectField from "../FormFieldComponents/SelectField";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import FloatNumberField from "../FormFieldComponents/FloatNumberField";

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
  const [installmentError, setInstallmentError] = useState(<></>);
  const [errorList, setErrorList] = useState<string[]>();
  
  const [editMode, setEditMode] = useState(false);
  const [added, setAdded] = useState(true);

  const {addPaymentSchedule, getPaymentSchedule} = useGlobalContext();

  useEffect(()=>{
    if (added)
      getPaymentSchedule(props.loanId).then(res=>{
        console.log("response",res);
        setAdded(false);
        if (res.status==200 && res.obj && res.obj[0] && res.obj[0]["data"] && Object.keys(res.obj[0]["data"]).length!=0){
          setFieldValues(res.obj[0]["data"][0]);
          console.log("values",res.obj[0]["data"][0])
          setEditMode(true);
          if (res.obj[0]["data"]["GS"])
            setSchedule(res.obj[0]["data"]["GS"]);
        }
      })
  },[added]);

  //useEffect(()=>console.log("SCHEDULE",schedule),[schedule]);

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

  const validateInstallmentAmounts = () =>{
    for (let i=0; i<schedule.length; i++){
      if (schedule[i].I==""){
        setInstallmentError(<p className="text-red-600 mx-3">Please fill all required fields.</p>);
        return;
      }
    }
    setInstallmentError(<></>)
    submitSchedule(schedule);
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
      setFieldValues({});
      setErrorMessage(<p className="text-green-600">Schedule successfully generated.</p>);
      setAdded(true);
    }
    else{
      if (fieldValues["T"]==InterestTypeList[1])
        setInstallmentError(<p className="text-yellow-600">Something went wrong</p>)
      else
        setErrorMessage(<p className="text-yellow-600">Something went wrong</p>)
    }
  }

  return(
    <div>
      <div className="grid grid-cols-2">
        {fieldList.fields.map((field,index)=>{
          if (field.type=="integer")
            return <IntegerField key={index} index={index} fieldData={field} prefillValues={fieldValues} setPrefillValues={setFieldValues} disabled={props.actionType=="VIEW"||(editMode&&(field.immutable||false))} error={errorList?.includes(field.id)} />
          else if (field.type=="date")
            return <DateField key={index} index={index} fieldData={field} prefillValues={fieldValues} setPrefillValues={setFieldValues} disabled={props.actionType=="VIEW"||(editMode&&(field.immutable||false))} error={errorList?.includes(field.id)} />
          else if (field.type=="select")
            return <SelectField key={index} index={index} fieldData={field} prefillValues={fieldValues} setPrefillValues={setFieldValues} disabled={props.actionType=="VIEW"||(editMode&&(field.immutable||false))} error={errorList?.includes(field.id)} />
          else if (field.type=="radio")
            return <RadioGroupField key={index} index={index} fieldData={field} prefillValues={fieldValues} setPrefillValues={setFieldValues} disabled={props.actionType=="VIEW"||(editMode&&(field.immutable||false))} />
        })}
        {fieldValues["T"]!=InterestTypeList[2]
          ?<FloatNumberField key={5} index={5} fieldData={{id:"I", name:"Interest Rate (%)", type:"float", required:true}} prefillValues={fieldValues} setPrefillValues={setFieldValues} disabled={props.actionType=="VIEW"||(editMode&&true)}  error={errorList?.includes("I")} />
          :""
        }
        <div className="my-10">
          {props.actionType=="VIEW"
            ?<></>
            :<button className={`${fieldValues["T"]!=InterestTypeList[2]?"float-right":"float-left"} h-[45px] w-[180px] rounded-xl text-white text-lg bg-custom-1`} onClick={validateFields}>
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
                headingRows={["Installment Number","Installment Date", "Installment Interest Rate(%)"]} headingClassNames={["w-[30%]","w-[30%]",""]}
                tableData={schedule} columnIDs={["D","I"]} dataTypes={["index","date","text-field"]} cellClassName={["","",""]}
                setValues={setSchedule} 
              />
              {installmentError}
              <button className="float-right my-9 h-[50px] w-[150px] rounded-xl text-white text-md bg-custom-1" onClick={()=>validateInstallmentAmounts()}>Generate Schedule</button>
            </DialogContent>
          </>
          :<></>
        }
      </Dialog>
      {errorMessage}
      <br />
      <FormSectionNavigation currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} sectionCount={props.sectionCount} goToNextSection={props.goToNextSection} isForm={false} />
    </div>
  )
}

export default LoanPaymentSchedule;