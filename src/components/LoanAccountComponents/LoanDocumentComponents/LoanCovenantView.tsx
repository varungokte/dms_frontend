import { useContext, useEffect, useState } from "react";
import { FieldValues } from "@/types/DataTypes";
import { LoanDocSecProps } from "@/types/ComponentProps";
import { TableColumnData } from "@/types/TableDataAttributes";
import { MasterValuesContext } from "@/Contexts";

import DataTable from "../../BasicTables/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";
import edit_icon from "@/static/edit_icon.svg";
import EmptyPageMessage from "@/components/BasicMessages/EmptyPageMessage";

function LoanCovenantView(props:LoanDocSecProps& {type:string}){
  const masters = useContext(MasterValuesContext);

  if (!masters) return;

  const { CovenantTypeList } = masters;
  
  const [filteredCovData, setFilteredCovData] = useState<FieldValues[]>();
  const [indexToSend, setIndexToSend] = useState<number[]>([]);

  const tableColumnData:TableColumnData = [
    {id:"N", heading:"Covenant Name", type:"text"},
    {id:"PL", heading:"Physical Location", type:"text"},
    {id:"EL", heading:"Execution Location", type:"text"},
    {id:"SD", heading:"Start Date", type:"date"},
    {id:"ED", heading:"End Date", type:"date"},
    {id:"P", heading:"Priority", type:"priority"}
  ];

  if(props.type==CovenantTypeList[1]){
    tableColumnData.splice(1,0,{id:"F", heading:"Frequency",type:"text"});
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
        tableData={filteredCovData.filter((document:any)=>document["T"]==props.type)} 
        columnData={tableColumnData}
        action = {props.disableEdit?filteredCovData.filter((document:any)=>document["T"]==props.type).map((_:any, index:number)=>{
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
        }):undefined}
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