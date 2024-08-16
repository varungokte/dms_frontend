import { ReactElement } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { DocumentStatusList, LoanStatusList, PriorityList, TeamStatusList, UserStatusList } from "../../../Constants";
import { DocumentStatus, FieldValues, LoanStatus, Priority, TableDataTypes, TeamStatus, UserStatus } from "DataTypes";

import { Table as MUITable } from '@mui/material';
import {TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import FloatNumberField from "../FormFieldComponents/FloatNumberField";
//import Checkbox from '@mui/material/Checkbox';
import Badge from '@mui/material/Badge';

const PriorityStyling = ["-", "text-green-600 bg-green-100", "text-yellow-600 bg-yellow-50", "text-red-600 bg-red-100"];
const UserStatusStyling = ["-", "text-yellow-600 bg-yellow-100", "text-green-600 bg-green-100", "text-red-600 bg-red-100"];
const TeamStatusStyling = ["-", "text-green-600 bg-green-100", "text-red-600 bg-red-100"];
const DocumentStatusStyling = ["-", "text-yellow-500", "text-blue-500", "text-green-600", "text-red-600"];
const LoanStatusStyling = ["-", "text-yellow-500", "text-blue-500", "text-green-600","text-orange-600", "text-red-800"];
//const FileStatusStyling = ["-", "text-yellow-500", "text-green-600"];

type HeaderRowsProps = {headingRows:string[], headingClassNames?:string[]};
type BodyRowsMappingProps = {
  tableData:FieldValues[], columnIDs:string[], dataTypes:TableDataTypes[], 
  cellClassName?:string[],
  action?:ReactElement[], 
  setEntityStatus?:Function, setSelectedEntity?:Function, setValues?:Function, 
  documentLinks?:{section:string,index:string|number}[], 
  defaultBadges?:boolean, indexStartsAt?:number
  selectable?:boolean, selectedEntity?:string
}

function DataTable(props:(HeaderRowsProps & BodyRowsMappingProps &{className?:string, style?:FieldValues})){
  return(
    <MUITable className={`${props.className} rounded-xl border`} sx={{minWidth:700,borderRadius:"13px", ...props.style }}>
      <HeaderRows headingRows={props.headingRows} headingClassNames={props.headingClassNames}/>
      <BodyRowsMapping {...props}  />
    </MUITable>
  )
}

function HeaderRows(props:HeaderRowsProps){
  return(
    <TableHead>
      <TableRow>
      {props.headingRows.map((heading,index)=>{
        return <TableCell key={index}>
          <div className={(props.headingClassNames && props.headingClassNames[index])?props.headingClassNames[index]:""}>{heading}</div>
        </TableCell>
      })}
      </TableRow>
    </TableHead>
  )
}

function BodyRowsMapping(props:BodyRowsMappingProps){
  return(
    <TableBody>
      {props.tableData.map((singleRow,index)=>{
        return <SingleRow key={index} rowIndex={index} singleRow={singleRow} cellClassName={props.cellClassName || []} dataTypes={props.dataTypes} action={props.action} columns={props.columnIDs} setEntityStatus={props.setEntityStatus} setSelectedEntity={props.setSelectedEntity} setValues={props.setValues} documentLinks={props.documentLinks} defaultBadges={props.defaultBadges} indexStartsAt={props.indexStartsAt||0} selectable={props.selectable} selectedEntity={props.selectedEntity} />
      })}
    </TableBody>
  )
}

function SingleRow(props:{rowIndex:number, dataTypes:TableDataTypes[], columns:string[], cellClassName?:string[], singleRow:FieldValues, action?:ReactElement[], setEntityStatus?:Function,setSelectedEntity?:Function, setValues?:Function, documentLinks?:{section:string,index:string|number}[],defaultBadges?:boolean, indexStartsAt:number, selectable?:boolean, selectedEntity?:string}){ 
  return (
    <TableRow key={props.rowIndex} 
      selected={props.selectable&&props.selectedEntity==props.singleRow["_id"]}
      onClick={()=>{props.selectable&&props.setSelectedEntity?props.setSelectedEntity(props.singleRow["_id"]):{}}} 
      sx={{backgroundColor:"rgba(251, 251, 255, 1)", cursor:props.selectable?"pointer":"default", border:props.selectedEntity&&props.selectedEntity==props.singleRow["_id"]?"solid rgba(80, 65, 188, 1)":""}} 
      hover 
    >
      {props.dataTypes.map((dataType, index)=>{
        let setBadge=false;
        if (props.defaultBadges && props.singleRow && props.singleRow["DEF"]==1 && index==0)
          setBadge=true;

        const cellClassName=(props.cellClassName && props.cellClassName[index])?props.cellClassName[index]:"";
        let textOverflow = "";
        if (dataType=="index" || dataType=="text")
          textOverflow+=" break-words	max-w-[200px]";
        
        return (
          <TableCell key={props.rowIndex+"_"+index} className={`${cellClassName} ${textOverflow}`}>
            {(()=>{
              if (dataType=="index")
                return handleIndex(props.indexStartsAt+props.rowIndex+1, cellClassName);
            
              else if (dataType=="action" && props.action)
                return handleAction(props.action[props.rowIndex], cellClassName)

              else if (dataType=="count-team")
                return handleCountTeam(props.singleRow, cellClassName);
              
              const item = props.singleRow[props.columns[props.dataTypes[0]=="index"?index-1:index]];
              const documentLink=(props.documentLinks && props.documentLinks[props.rowIndex])?props.documentLinks[props.rowIndex]:undefined;
              if (dataType=="date")
                return handleDate(item, cellClassName);
              else if (dataType=="priority")
                return handlePriority(item, cellClassName);
              else if (dataType=="doc-status")
                return handleDocStatus(item, cellClassName);
              else if (dataType=="user-status")
                return handleUserStatus(item, cellClassName, props.rowIndex, props.setSelectedEntity||(()=>{}), props.setEntityStatus||(()=>{}));
              else if (dataType=="team-status")
                return handleTeamStatus(item, cellClassName, props.rowIndex, props.setSelectedEntity||(()=>{}), props.setEntityStatus||(()=>{}));
              else if (dataType=="loan-status")
                return handleLoanStatus(item, cellClassName);
              else if (dataType=="obj-name")
                return handleObjName(item, cellClassName);
              else if (dataType=="text-field")
                return handleTextField(item,cellClassName, props.rowIndex, props.columns[props.dataTypes[0]=="index"?index-1:index], props.setValues||(()=>{}));
              else if (dataType=="doc-link")
                return handleDocumentLink(item, cellClassName, documentLink);
              else
                return handleText(item, cellClassName, setBadge);
            })()}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

const handleIndex = (index:number, cellClassName:string) =>{
  return <div className={cellClassName}>{index}</div>
}

const handleText = (item:string, cellClassName:string, setBadge?:boolean) => {
  return <div className={cellClassName}>
    {setBadge
      ?<Badge
        badgeContent="Default"
        color="error"
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }} 
        sx={{ marginLeft:"10px", marginBottom:"15px", zIndex:39 }}
      />
      :<></>
    }
    <div>{item}</div>
  </div>
}

const handleDate = (item:string, cellClassName:string) => {
  return <div className={cellClassName}>{moment(item).format("DD-MM-yyyy")}</div>
}

const handlePriority = (priority:Priority, cellClassName:string) => {
  return <div className={`${PriorityStyling[PriorityList.indexOf(priority)]} text-center ${cellClassName} p-1.5`} style={{borderRadius:"7px"}}>{priority}</div>
}

const handleDocStatus = (status:DocumentStatus, cellClassName:string) => {
  return <div className={`${DocumentStatusStyling[DocumentStatusList.indexOf(status||"Pending")]} ${cellClassName}`}>{status||"Pending"}</div>
}


const handleLoanStatus = (status:LoanStatus, cellClassName:string) => {
  return <div className={`${LoanStatusStyling[LoanStatusList.indexOf(status)]} ${cellClassName}`}>{status}</div>
}

const handleUserStatus = (status:UserStatus, cellClassName:string, selectedUser:number, setSelectedUser:Function, setUserStatus:Function) => {
  const editable = cellClassName.search("editable")!=-1;
  const className =`${UserStatusStyling[UserStatusList.indexOf(status)]} w-28 text-center rounded-xl ${cellClassName}`
  if (editable)
    return <select className={`${className} h-10`} value={status} onChange={e=>{setSelectedUser(selectedUser); setUserStatus(e.target.value)}}>
      {UserStatusList.map((status,index)=>{
        if (status!="-")
          return <option key={index} className={`${UserStatusStyling[index]}`}>{status}</option>
      })}
    </select>
  else
    return <p className={`${className} p-2`}>{status}</p>
  
}

const handleTeamStatus = (status:TeamStatus, cellClassName:string, selectedTeam:number, setSelectedTeam:Function, setTeamStatus:Function) => {
  const editable =cellClassName.search("editable")!=-1;
  const className = `${TeamStatusStyling[TeamStatusList.indexOf(status)]} w-28 text-center rounded-xl ${cellClassName}`
  
  if (editable)
    return <select className={`${className} h-10`} 
      value={status} onChange={e=>{setSelectedTeam(selectedTeam); setTeamStatus(e.target.value)}}>
      {TeamStatusList.map((status,index)=>{
        if (status!="-")
          return <option key={index} className={`${TeamStatusStyling[index]} p-2`}>{status}</option>
      })}
    </select>
  else
    return <p className={`${className} p-2`}>{status}</p>
}

const handleAction = (action:any, cellClassName:string) => {
  return <div className={cellClassName}>{action}</div>
}

const handleObjName = (item:any, cellClassName:string) =>{
  return <div className={cellClassName}>{item.N}</div>
}

const handleCountTeam = (obj:any, cellClassName:string) => {
  const sections = ["TD","CD","C","CP","CS"];
  let count = 1;
  sections.map(name=>{
    count+=obj[name]["M"].length+obj[name]["C"].length
  });
  return <div className={cellClassName}>{count}</div>
}
const handleTextField = (prefillValue:any, cellClassName:string, tableIndex:number, columnId:string, setPrefillValue:Function) => {
  return <div className={cellClassName}>
    <FloatNumberField index={tableIndex} fieldData={{id:columnId, name:"", type:"float"}} disabled={false} className={"border-2 rounded-if h-7 mt-5 p-1"}
      prefillValues={{[tableIndex]:{[columnId]:prefillValue}}} setPrefillValues={setPrefillValue} 
      repeatFields formIndex={tableIndex}
    /> 
  </div>
}

const handleDocumentLink = (item:ReactElement, cellClassName:string, link:{section:string,index:string|number}|undefined) => {
  if (link) return <Link to={link.section} className={cellClassName} state={link.index}>{item}</Link>
}

/* const handleCheckbox = (id:string, selectedEntity:string, setSelectedEntity:Function) => {
  return <Checkbox color="secondary" checked={id==selectedEntity} onChange={()=>setSelectedEntity(id)} />
}
 */
export { DataTable, HeaderRows, BodyRowsMapping };