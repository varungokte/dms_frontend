import { useEffect, useState } from "react";
import { CovenantTypeList } from "./../../../../Constants";
import { FieldAttributesList, FieldValues } from "./../../../../DataTypes";

import { Table } from "@/components/ui/table";
import { BodyRowsMapping, HeaderRows } from "../../BasicComponents/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";
import edit_icon from "./../../static/edit_icon.svg";
import EmptyPageMessage from "@/components/BasicComponents/EmptyPageMessage";

function LoanCovenantView(props:{type:string,covData:FieldValues[],label:string, fieldList:FieldAttributesList, editCovenantFunction:Function, deleteCovenantFunction:Function, addFileFunction:Function, deleteFileFunction:Function, getFileListFunction:Function}){
  const [filteredCovData, setFilteredCovData] = useState<FieldValues[]>();
  const [indexToSend, setIndexToSend] = useState<number[]>([])
  
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
      <Table className="border rounded-2xl">
        <HeaderRows headingRows={["Covenant Name","Frequency", "Physical Location", "Execution Location", "Start Date","End Date", "Priority", "Action"]} />
        <BodyRowsMapping
          list={filteredCovData.filter((document:any)=>document["T"]==CovenantTypeList[1])} columns={["N", "F","PL","EL", "SD", "ED","P"]} dataType={["text", "frequency", "text", "text", "date", "date", "priority", "action"]}
          action = {filteredCovData.filter((document:any)=>document["T"]==CovenantTypeList[1]).map((item:any, index:number)=>{
            item;
            return(
              <div className="flex flex-row">
                <FormDialogDocuments key={index} index={index} edit={true} type="cov"
                  triggerText={<img src={edit_icon} /* className="mr-5" *//>} triggerClassName="" titleText={props.label}
                  detailSubmit={props.editCovenantFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                  formFields={props.fieldList} currentFields={filteredCovData[index]} currIndex={indexToSend[index]}
                />
                {/* <DeleteConfirmation thing="covenant" deleteFunction={props.deleteCovenantFunction} currIndex={index}/> */}
              </div>
            )
          })}
        />
      </Table>
    )
  else
    return (
      <Table>
        <HeaderRows headingRows={["Covenant Name", "Physical Location", "Execution Location", "Start Date","End Date", "Priority", "Action"]} />
        <BodyRowsMapping list={filteredCovData.filter((document:any)=>document["T"]==CovenantTypeList[2])} columns={["N","PL","EL", "SD", "ED","P"]} dataType={["text", "text", "text", "date", "date", "priority", "action"]}
          action = {filteredCovData.filter((document:any)=>document["T"]==CovenantTypeList[2]).map((item:any, index:number)=>{
            item;
            return(
              <div className="flex flex-row">
                <FormDialogDocuments key={index} index={index} edit={true} type="cov"
                  triggerText={<img src={edit_icon} /* className="mr-5" *//>} triggerClassName="" titleText={props.label}
                  detailSubmit={props.editCovenantFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                  formFields={props.fieldList} currentFields={filteredCovData[index]} currIndex={indexToSend[index]}
                />
                {/* <DeleteConfirmation thing="covenant" deleteFunction={props.deleteCovenantFunction} currIndex={index}/> */}
              </div>
            )
          })}
        />
      </Table>
    )
}

export default LoanCovenantView;