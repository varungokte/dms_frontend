import { useEffect, useState } from "react";
import { CovenantTypeList } from "@/functions/Constants";
import { FieldValues, TableDataTypes } from "@/types/DataTypes";
import { LoanDocSecProps } from "@/types/ComponentProps";

import { DataTable } from "../../BasicTables/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";
import edit_icon from "@/static/edit_icon.svg";
import EmptyPageMessage from "@/components/BasicMessages/EmptyPageMessage";

function LoanCovenantView(props:LoanDocSecProps& {type:string}){
  const [filteredCovData, setFilteredCovData] = useState<FieldValues[]>();
  const [indexToSend, setIndexToSend] = useState<number[]>([]);

  const tableRows = ["Covenant Name", "Physical Location", "Execution Location", "Start Date","End Date", "Priority"];
  const tableDataTypes:TableDataTypes[] = ["text", "text", "text", "date", "date", "priority"];
  const tableColumnIDs = ["N","PL","EL", "SD", "ED","P"];

  if(props.type==CovenantTypeList[1]){
    tableRows.splice(1,0,"Frequency");
    tableDataTypes.splice(1,0,"text");
    tableColumnIDs.splice(1,0,"F");
  }
  
  useEffect(()=>{
    const arr:FieldValues[]=[];
    const arr2:number[]=[];

    props.data.map((cov,index)=>{
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
  
  //if (props.type==CovenantTypeList[1])
    return (
      <DataTable className="border rounded-2xl"
        headingRows={props.disableEdit?tableRows:tableRows.concat(["Action"])}
        tableData={filteredCovData.filter((document:any)=>document["T"]==props.type)} columnIDs={tableColumnIDs} dataTypes={props.disableEdit?tableDataTypes:tableDataTypes.concat(["action"])}
        action = {filteredCovData.filter((document:any)=>document["T"]==props.type).map((item:any, index:number)=>{
          item;
          return(
            <div className="flex flex-row">
              {props.disableEdit
                ?<></>
                :<div>
                  <button onClick={()=>props.setFormOpen((curr:boolean[])=>{curr[index]=true;return [...curr]})}><img src={edit_icon} /* className="mr-5" *//></button>
                  {props.formOpen[index]
                    ?<FormDialogDocuments key={index} index={index} edit={true} type="covenant"
                      formOpen={props.formOpen[index]} setFormOpen={props.setFormOpen} formTitle={props.label} formSize="md"
                      detailSubmit={props.editFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                      formFields={props.fieldList} currentFields={filteredCovData[index]} currIndex={indexToSend[index]} setAdded={props.setAdded}
                    />
                    :<></>
                  }
                </div>
              }
              {/* <DeleteConfirmation thing="covenant" deleteFunction={props.deleteCovenantFunction} currIndex={index}/> */}
            </div>
          )
        })}
      />
    )
  /* else
    return (
      <DataTable headingRows={props.disableEdit?tableRows:tableRows.concat(["Action"])}
        tableData={filteredCovData.filter((document:any)=>document["T"]==CovenantTypeList[2])} columnIDs={tableColumnIDs} dataTypes={tableDataTypes.concat(["action"])}
        action = {filteredCovData.filter((document:any)=>document["T"]==CovenantTypeList[2]).map((item:any, index:number)=>{
          item;
          return(
            <div className="flex flex-row">
              {props.disableEdit
                ?<></>
                :<div>
                  <button onClick={()=>props.setFormOpen((curr:boolean[])=>{curr[index]=true;return [...curr]})}><img src={edit_icon} className="mr-5"/></button>
                  <FormDialogDocuments key={index} index={index} edit={true} type="cov"
                    formOpen={props.formOpen[index]} setFormOpen={props.setFormOpen} formTitle={props.label}
                    detailSubmit={props.editCovenantFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                    formFields={props.fieldList} currentFields={filteredCovData[index]} currIndex={indexToSend[index]} setAdded={props.setAdded}
                  />
                </div>
              }
              <DeleteConfirmation thing="covenant" deleteFunction={props.deleteCovenantFunction} currIndex={index}/>
            </div>
          )
        })}
      />
    ) */
}

export default LoanCovenantView;