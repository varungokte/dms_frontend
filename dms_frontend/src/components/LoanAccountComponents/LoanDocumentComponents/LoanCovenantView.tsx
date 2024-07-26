import { useEffect, useState } from "react";
import { CovenantTypeList } from "./../../../../Constants";
import { FieldAttributesList, FieldValues, TableDataTypes } from "./../../../../DataTypes";

import { DataTable } from "../../BasicComponents/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";
import edit_icon from "./../../static/edit_icon.svg";
import EmptyPageMessage from "@/components/BasicComponents/EmptyPageMessage";

function LoanCovenantView(props:{type:string,covData:FieldValues[],label:string, fieldList:FieldAttributesList, editCovenantFunction:Function, deleteCovenantFunction:Function, addFileFunction:Function, deleteFileFunction:Function, getFileListFunction:Function, setAdded:Function, disableEdit?:boolean}){
  const [filteredCovData, setFilteredCovData] = useState<FieldValues[]>();
  const [indexToSend, setIndexToSend] = useState<number[]>([]);

  const tableRowsPeriodic = ["Covenant Name","Frequency", "Physical Location", "Execution Location", "Start Date","End Date", "Priority"];
  const tableDataTypesPeriodic:TableDataTypes[] = ["text", "frequency", "text", "text", "date", "date", "priority"];

  const tableRowsFixed = ["Covenant Name", "Physical Location", "Execution Location", "Start Date","End Date", "Priority"];
  const tableDataTypesFixed:TableDataTypes[] = ["text", "text", "text", "date", "date", "priority"];
  
  useEffect(()=>{
    const arr:FieldValues[]=[];
    const arr2:number[]=[];

    props.covData.map((cov,index)=>{
      if (cov["T"]==props.type){
        arr.push(cov);
        arr2.push(index)
      }
    })
    
    if (arr.length!=0){
      setFilteredCovData(arr);
      setIndexToSend(arr2);
    }
    else{
      setFilteredCovData(undefined)
      setIndexToSend([])
    }
  },[props])
  
  if (!filteredCovData || filteredCovData.length==0)
    return <EmptyPageMessage sectionName={`${props.type.toLowerCase()} covenants`} />
  
  if (props.type==CovenantTypeList[1])
    return (
      <DataTable className="border rounded-2xl"
        headingRows={props.disableEdit?tableRowsPeriodic:tableRowsPeriodic.concat(["Action"])}
        tableData={filteredCovData.filter((document:any)=>document["T"]==CovenantTypeList[1])} columnIDs={["N", "F","PL","EL", "SD", "ED","P"]} dataTypes={props.disableEdit?tableDataTypesPeriodic:tableDataTypesPeriodic.concat(["action"])}
        action = {filteredCovData.filter((document:any)=>document["T"]==CovenantTypeList[1]).map((item:any, index:number)=>{
          item;
          return(
            <div className="flex flex-row">
              {props.disableEdit
                ?<></>
                :<FormDialogDocuments key={index} index={index} edit={true} type="cov"
                  triggerText={<img src={edit_icon} /* className="mr-5" *//>} triggerClassName="" titleText={props.label}
                  detailSubmit={props.editCovenantFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                  formFields={props.fieldList} currentFields={filteredCovData[index]} currIndex={indexToSend[index]} setAdded={props.setAdded}
                />
              }
              {/* <DeleteConfirmation thing="covenant" deleteFunction={props.deleteCovenantFunction} currIndex={index}/> */}
            </div>
          )
        })}
      />
    )
  else
    return (
      <DataTable headingRows={props.disableEdit?tableRowsFixed:tableRowsFixed.concat(["Action"])}
        tableData={filteredCovData.filter((document:any)=>document["T"]==CovenantTypeList[2])} columnIDs={["N","PL","EL", "SD", "ED","P"]} dataTypes={tableDataTypesFixed.concat(["action"])}
        action = {filteredCovData.filter((document:any)=>document["T"]==CovenantTypeList[2]).map((item:any, index:number)=>{
          item;
          return(
            <div className="flex flex-row">
              {props.disableEdit
                ?<></>
                :<FormDialogDocuments key={index} index={index} edit={true} type="cov"
                  triggerText={<img src={edit_icon} /* className="mr-5" *//>} triggerClassName="" titleText={props.label}
                  detailSubmit={props.editCovenantFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                  formFields={props.fieldList} currentFields={filteredCovData[index]} currIndex={indexToSend[index]} setAdded={props.setAdded}
                />
              }
              {/* <DeleteConfirmation thing="covenant" deleteFunction={props.deleteCovenantFunction} currIndex={index}/> */}
            </div>
          )
        })}
      />
    )
}

export default LoanCovenantView;